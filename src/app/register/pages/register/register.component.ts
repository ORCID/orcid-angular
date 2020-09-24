import { StepperSelectionEvent } from '@angular/cdk/stepper'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ErrorHandler,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatStep } from '@angular/material/stepper'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { EMPTY, of } from 'rxjs'
import { first, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { isRedirectToTheAuthorizationPage } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { RequestInfoForm } from 'src/app/types'
import {
  RegisterConfirmResponse,
  RegisterForm,
} from 'src/app/types/register.endpoint'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { ERROR_REPORT } from 'src/app/errors'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('lastStep') lastStep: MatStep
  @ViewChild('stepComponentA', { read: ElementRef }) stepComponentA: ElementRef
  @ViewChild('stepComponentB', { read: ElementRef }) stepComponentB: ElementRef
  @ViewChild('stepComponentC', { read: ElementRef }) stepComponentC: ElementRef
  platform: PlatformInfo
  FormGroupStepA: FormGroup
  FormGroupStepB: FormGroup
  FormGroupStepC: FormGroup
  isLinear = true
  personalData: RegisterForm
  backendForm: RegisterForm
  loading = false
  requestInfoForm: RequestInfoForm | null
  constructor(
    private _cdref: ChangeDetectorRef,
    private _platformInfo: PlatformInfoService,
    private _formBuilder: FormBuilder,
    private _register: RegisterService,
    private _dialog: MatDialog,
    @Inject(WINDOW) private window: Window,
    private _gtag: GoogleAnalyticsService,
    private _user: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _errorHandler: ErrorHandlerService
  ) {
    _platformInfo.get().subscribe((platform) => {
      this.platform = platform
    })
  }
  ngOnInit() {
    this._register.getRegisterForm().subscribe()

    this.FormGroupStepA = this._formBuilder.group({
      personal: [''],
    })
    this.FormGroupStepB = this._formBuilder.group({
      password: [''],
      sendOrcidNews: [''],
    })
    this.FormGroupStepC = this._formBuilder.group({
      activitiesVisibilityDefault: [''],
      termsOfUse: [''],
      captcha: [''],
    })

    this._platformInfo
      .get()
      .pipe(
        mergeMap((platform) => {
          if (platform.oauthMode) {
            return this._user.getUserSession().pipe(
              first(),
              map((session) => session.oauthSession),
              tap((requestInfoForm) => {
                if (requestInfoForm) {
                  this.requestInfoForm = requestInfoForm
                  this.FormGroupStepA = this.prefillRegisterForm(
                    this.requestInfoForm
                  )
                } else {
                  // for a oauth call the backend was expected to return a oauth context
                  this._errorHandler.handleError(new Error('registerOauth'))
                }
              })
            )
          } else if (platform.social || platform.institutional) {
            return this._user.getUserSession().pipe(
              first(),
              map((session) => session.oauthSession),
              tap((requestInfoForm) => {
                if (requestInfoForm) {
                  this.requestInfoForm = requestInfoForm
                  this.FormGroupStepA = this.prefillRegisterForm(
                    this.requestInfoForm
                  )
                } else {
                  return of(
                    (this.FormGroupStepA = this.prefillRegisterForm(
                      this.platform.queryParameters
                    ))
                  )
                }
              })
            )
          } else {
            return EMPTY
          }
        })
      )
      .subscribe()
  }

  ngAfterViewInit(): void {
    this._cdref.detectChanges()
  }

  register() {
    this.loading = true
    this.lastStep.interacted = true
    if (
      this.FormGroupStepA.valid &&
      this.FormGroupStepB.valid &&
      this.FormGroupStepC.valid
    ) {
      this._register
        .backendRegisterFormValidate(
          this.FormGroupStepA,
          this.FormGroupStepB,
          this.FormGroupStepC
        )
        .pipe(
          switchMap((validator: RegisterForm) => {
            if (validator.errors.length > 0) {
              // At this point any backend error is unexpected
              this._errorHandler.handleError(
                new Error('registerUnexpectedValidateFail'),
                ERROR_REPORT.REGISTER
              )
            }
            return this._register.register(
              this.FormGroupStepA,
              this.FormGroupStepB,
              this.FormGroupStepC,
              this.requestInfoForm,
              this.platform.oauthMode // request client service to be update (only when the next navigation wont go outside this app)
            )
          })
        )
        .subscribe((response) => {
          this.loading = false
          if (response.url) {
            this._gtag
              .reportEvent(
                'RegGrowth',
                'New-Registration',
                this.requestInfoForm || 'Website'
              )
              .subscribe(
                () => this.afterRegisterRedirectionHandler(response),
                () => this.afterRegisterRedirectionHandler(response)
              )
          } else {
            this._errorHandler.handleError(
              new Error('registerUnexpectedConfirmation'),
              ERROR_REPORT.REGISTER
            )
          }
        })
    } else {
      this.loading = false
    }
  }

  afterRegisterRedirectionHandler(response: RegisterConfirmResponse) {
    if (isRedirectToTheAuthorizationPage(response)) {
      this._platformInfo
        .get()
        .pipe(first())
        .subscribe((platform) =>
          this._router.navigate(['/oauth/authorize'], {
            queryParams: platform.queryParameters,
          })
        )
    } else {
      this.window.location.href = response.url
    }
  }

  afterStepASubmitted() {
    // Update the personal data object is required after submit since is an input for StepB

    if (this.FormGroupStepA.valid) {
      this.personalData = this.FormGroupStepA.value.personal

      this._register
        .checkDuplicatedResearcher({
          familyNames: this.personalData.familyNames.value,
          givenNames: this.personalData.givenNames.value,
        })
        .subscribe((value) => {
          if (value.length > 0) {
            this.openDialog(value)
          }
        })
    }
  }

  openDialog(duplicateRecords): void {
    const dialogParams = {
      width: `1078px`,
      height: `600px`,
      maxWidth: `90vw`,

      data: {
        duplicateRecords,
        titleLabel: $localize`:@@register.titleLabel:Could this be you?`,
        // tslint:disable-next-line: max-line-length
        bodyLabel: $localize`:@@register.bodyLabel:We found some accounts with your name, which means you may have already created an ORCID iD using a different email address. Before creating an account, please confirm that none of these records belong to you. Not sure if any of these are you?`,
        contactLabel: $localize`:@@register.contactLabel:Contact us.`,
        firstNameLabel: $localize`:@@register.firstNameLabel:First Name`,
        lastNameLabel: $localize`:@@register.lastNameLabel:Last Name`,
        affiliationsLabel: $localize`:@@register.affiliationsLabel:Affiliations`,
        dateCreatedLabel: $localize`:@@register.dateCreatedLabel:Date Created`,
        viewRecordLabel: $localize`:@@register.viewRecordLabel:View Record`,
        signinLabel: $localize`:@@register.signinLabel:I ALREADY HAVE AN ID, GO BACK TO SIGN IN`,
        continueLabel: $localize`:@@register.continueLabel:NONE OF THESE ARE ME, CONTINUE WITH REGISTRATION`,
      },
    }

    if (this.platform.tabletOrHandset) {
      dialogParams['maxWidth'] = '95vw'
      dialogParams['maxHeight'] = '95vh'
    }

    const dialogRef = this._dialog.open(IsThisYouComponent, dialogParams)

    dialogRef.afterClosed().subscribe((confirmRegistration) => {
      if (confirmRegistration) {
      }
    })
  }

  selectionChange(event: StepperSelectionEvent) {
    if (event.previouslySelectedIndex === 0) {
      this.afterStepASubmitted()
    }
    if (this.platform.columns4 || this.platform.columns8) {
      this.focusCurrentStep(event)
    }
  }

  // Fix to material vertical stepper not focusing current header
  // related issue https://github.com/angular/components/issues/8881
  focusCurrentStep(event: StepperSelectionEvent) {
    let nextStep: ElementRef
    if (event.selectedIndex === 0) {
      nextStep = this.stepComponentA
    } else if (event.selectedIndex === 1) {
      nextStep = this.stepComponentB
    } else if (event.selectedIndex === 2) {
      nextStep = this.stepComponentC
    }
    // On mobile scroll the current step component into view
    if (this.platform.columns4 || this.platform.columns8) {
      setTimeout(() => {
        const nativeElementNextStep = <HTMLElement>nextStep.nativeElement
        nativeElementNextStep.scrollIntoView()
      }, 200)
    }
  }

  private prefillRegisterForm(value: RequestInfoForm | Params) {
    return this._formBuilder.group({
      personal: [
        {
          givenNames: value.userGivenNames || value['firstName'] || '',
          familyNames: value.userFamilyNames || value['lastName'] || '',
          emails: {
            email: value.userEmail || value['email'] || '',
            confirmEmail: '',
            additionalEmails: { '0': '' },
          },
        },
      ],
    })
  }
}
