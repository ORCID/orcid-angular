import { StepperSelectionEvent } from '@angular/cdk/stepper'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatStep } from '@angular/material/stepper'
import { Router } from '@angular/router'
import { combineLatest, forkJoin, Observable } from 'rxjs'
import { catchError, first, map, switchMap } from 'rxjs/operators'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { isRedirectToTheAuthorizationPage } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { GoogleUniversalAnalyticsService } from 'src/app/core/google-analytics/google-universal-analytics.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { RequestInfoForm } from 'src/app/types'
import {
  RegisterConfirmResponse,
  RegisterForm,
} from 'src/app/types/register.endpoint'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { ERROR_REPORT } from 'src/app/errors'
import { UserSession } from 'src/app/types/session.local'
import { ThirdPartyAuthData } from 'src/app/types/sign-in-data.endpoint'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { SearchService } from '../../../core/search/search.service'
import { SearchParameters, SearchResults } from 'src/app/types'
import { GoogleTagManagerService } from '../../../core/google-tag-manager/google-tag-manager.service'

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
  FormGroupStepA: UntypedFormGroup
  FormGroupStepB: UntypedFormGroup
  FormGroupStepC: UntypedFormGroup
  isLinear = true
  personalData: RegisterForm
  backendForm: RegisterForm
  loading = false
  requestInfoForm: RequestInfoForm | null
  thirdPartyAuthData: ThirdPartyAuthData
  reactivation = {
    isReactivation: false,
    reactivationCode: '',
  } as ReactivationLocal

  constructor(
    private _cdref: ChangeDetectorRef,
    private _platformInfo: PlatformInfoService,
    private _formBuilder: UntypedFormBuilder,
    private _register: RegisterService,
    private _dialog: MatDialog,
    @Inject(WINDOW) private window: Window,
    private _gtag: GoogleUniversalAnalyticsService,
    private _googleTagManagerService: GoogleTagManagerService,
    private _user: UserService,
    private _router: Router,
    private _errorHandler: ErrorHandlerService,
    private _userInfo: UserService,
    private _searchService: SearchService
  ) {
    _platformInfo.get().subscribe((platform) => {
      this.platform = platform
      this.reactivation.isReactivation = this.platform.reactivation
      this.reactivation.reactivationCode = this.platform.reactivationCode
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

    combineLatest([this._userInfo.getUserSession(), this._platformInfo.get()])
      .pipe(
        first(),
        map(([session, platform]) => {
          session = session as UserSession
          platform = platform as PlatformInfo

          // TODO @leomendoza123 move the handle of social/institutional sessions to the user service

          this.thirdPartyAuthData = session.thirdPartyAuthData
          this.requestInfoForm = session.oauthSession

          if (this.thirdPartyAuthData || this.requestInfoForm) {
            this.FormGroupStepA = this.prefillRegisterForm(
              this.requestInfoForm,
              this.thirdPartyAuthData
            )
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
              this.reactivation,
              this.requestInfoForm,
              true
            )
          })
        )
        .subscribe((response) => {
          this.loading = false
          if (response.url) {
            const analyticsReports: Observable<void>[] = []

            analyticsReports.push(
              this._gtag.reportEvent(
                'New-Registration',
                'RegGrowth',
                this.requestInfoForm || 'Website'
              )
            )
            analyticsReports.push(
              this._googleTagManagerService.reportEvent(
                'New-Registration',
                this.requestInfoForm || 'Website'
              )
            )
            forkJoin(analyticsReports)
              .pipe(
                catchError((err) =>
                  this._errorHandler.handleError(
                    err,
                    ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
                  )
                )
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
      this.window.location.href = response.url
    } else {
      if (
        response.url.indexOf('orcid.org/my-orcid') > 0 &&
        response.url.indexOf('justRegistered') > 0
      ) {
        this.window.scrollTo(0, 0)
        this._router
          .navigate(['/my-orcid'], {
            queryParams: { justRegistered: true },
          })
          .then(() => {
            this.window.scrollTo(0, 0)
          })
      } else {
        this.window.location.href = response.url
      }
    }
  }

  afterStepASubmitted() {
    // Update the personal data object is required after submit since is an input for StepB

    if (!this.reactivation?.isReactivation) {
      if (this.FormGroupStepA.valid) {
        this.personalData = this.FormGroupStepA.value.personal
        const searchValue =
          this.personalData.familyNames.value +
          ' ' +
          this.personalData.givenNames.value
        const searchParams: SearchParameters = {}
        searchParams.searchQuery = searchValue

        this._searchService.search(searchParams).subscribe((value) => {
          if (value['num-found'] > 0) {
            this.openDialog(value)
          }
        })
      }
    }
  }

  openDialog(duplicateRecordsSearchResults: SearchResults): void {
    const duplicateRecords = duplicateRecordsSearchResults['expanded-result']
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
      if (!confirmRegistration) {
        this._router.navigate(['signin'])
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
        const nativeElementNextStep = nextStep.nativeElement as HTMLElement
        nativeElementNextStep.scrollIntoView()
      }, 200)
    }
  }

  /**
   * Fills the register form.
   * Use the data from the Oauth session send by the Orcid integrator
   * or
   * Use data coming from a third party institution/social entity
   * or
   * Use empty values
   */
  private prefillRegisterForm(
    oauthData: RequestInfoForm,
    thirdPartyOauthData: ThirdPartyAuthData
  ) {
    return this._formBuilder.group({
      personal: [
        {
          givenNames:
            oauthData?.userGivenNames ||
            thirdPartyOauthData?.signinData?.firstName ||
            '',
          familyNames:
            oauthData?.userFamilyNames ||
            thirdPartyOauthData?.signinData?.lastName ||
            '',
          emails: {
            email:
              oauthData?.userEmail ||
              thirdPartyOauthData?.signinData?.email ||
              '',
            confirmEmail: '',
            additionalEmails: { '0': '' },
          },
        },
      ],
    })
  }
}
