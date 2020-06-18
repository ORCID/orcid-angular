import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { RegisterService } from 'src/app/core/register/register.service'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { switchMap, tap, map } from 'rxjs/operators'
import { MatStep } from '@angular/material/stepper'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW } from 'src/app/cdk/window'
import { ActivatedRoute } from '@angular/router'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { RequestInfoForm, OauthParameters } from 'src/app/types'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('lastStep') lastStep: MatStep
  @ViewChild('stepComponentA', { read: ElementRef }) stepComponentA: ElementRef
  @ViewChild('stepComponentB', { read: ElementRef }) stepComponentB: ElementRef
  @ViewChild('stepComponentC', { read: ElementRef }) stepComponentC: ElementRef
  platform: PlatformInfo
  FormGroupStepA: FormGroup = new FormGroup({})
  FormGroupStepB: FormGroup = new FormGroup({})
  FormGroupStepC: FormGroup = new FormGroup({})
  isLinear = true
  personalData: RegisterForm
  backendForm: RegisterForm
  loading = false
  requestInfoForm: RequestInfoForm | null
  constructor(
    _platformInfo: PlatformInfoService,
    private _register: RegisterService,
    private _dialog: MatDialog,
    @Inject(WINDOW) private window: Window,
    private _gtag: GoogleAnalyticsService,
    private _oauth: OauthService,
    private _route: ActivatedRoute
  ) {
    _platformInfo.get().subscribe((platform) => {
      this.platform = platform
    })
  }
  ngOnInit() {
    this._register.getRegisterForm().subscribe()
    this._route.queryParams
      .pipe(
        // TODO use the
        // Check if there is a client_id parameter on the GET parameters
        map((value: OauthParameters) => !!value.client_id),
        // TODO leomendoza123 use platform service to check if Oauth mode
        // If there is a Oauth parameter load the oauth context info
        switchMap((triggeredByOauth) => {
          if (triggeredByOauth) {
            return this._oauth.loadRequestInfoFormFromMemory().pipe(
              tap((value) => {
                if (value) {
                  this.requestInfoForm = value
                } else {
                  // TODO @leomendoza123 show toaster error
                  // for a oauth call the backend was expected to return a oauth context
                  //
                  // TODO @leomendoza123 this should be tested once https://trello.com/c/xoTzzqSl/6675-signin-oauth-support is ready
                  // currently the response is always empty
                }
              })
            )
          }
        })
      )
      .subscribe()
  }

  register(value) {
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
              // TODO @leomendoza123 HANDLE ERROR show toaster
            }
            return this._register.register(
              this.FormGroupStepA,
              this.FormGroupStepB,
              this.FormGroupStepC,
              null, // TODO @leomendoza123 support shibboleth https://github.com/ORCID/orcid-angular/issues/206
              this.requestInfoForm
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
                () => (this.window.location.href = response.url),
                () => (this.window.location.href = response.url)
              )
          } else {
            // TODO @leomendoza123 HANDLE ERROR show toaster
          }
        })
    } else {
      this.loading = false
      // TODO @leomendoza123 HANDLE ERROR show toaster
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
      // TODO @leomendoza123 HANDLE ERROR show toaster
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
}
