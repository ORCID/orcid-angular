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
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatStep, MatStepper } from '@angular/material/stepper'
import { Router } from '@angular/router'
import { Observable, combineLatest, forkJoin } from 'rxjs'
import { catchError, first, map, switchMap } from 'rxjs/operators'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { isRedirectToTheAuthorizationPage } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { Register2Service } from 'src/app/core/register2/register2.service'
import { ERROR_REPORT } from 'src/app/errors'
import { RequestInfoForm, SearchResults } from 'src/app/types'
import {
  RegisterConfirmResponse,
  RegisterForm,
} from 'src/app/types/register.endpoint'
import { UserSession } from 'src/app/types/session.local'
import { ThirdPartyAuthData } from 'src/app/types/sign-in-data.endpoint'
import { GoogleTagManagerService } from '../../../core/google-tag-manager/google-tag-manager.service'
import { SearchService } from '../../../core/search/search.service'
import { ReactivationLocal } from '../../../types/reactivation.local'
import {
  CustomEventService,
  JourneyType,
} from 'src/app/core/observability-events/observability-events.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-register-2',
  templateUrl: './register2.component.html',
  styleUrls: [
    './register2.component.scss',
    './register2.component.scss.theme.scss',
    '../../components/register2.scss-theme.scss',
    '../../components/register2.style.scss',
  ],
})
export class Register2Component implements OnInit, AfterViewInit {
  @ViewChild('lastStep') lastStep: MatStep
  @ViewChild('stepComponentA', { read: ElementRef }) stepComponentA: ElementRef
  @ViewChild('stepComponentB', { read: ElementRef }) stepComponentB: ElementRef
  @ViewChild('stepComponentC', { read: ElementRef }) stepComponentC: ElementRef
  @ViewChild('stepComponentC2', { read: ElementRef })
  stepComponentC2: ElementRef
  @ViewChild('stepComponentD', { read: ElementRef }) stepComponentD: ElementRef

  platform: PlatformInfo
  FormGroupStepA: UntypedFormGroup
  FormGroupStepB: UntypedFormGroup
  FormGroupStepC: UntypedFormGroup
  FormGroupStepC2: UntypedFormGroup
  FormGroupStepD: UntypedFormGroup

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
  stepControlStepC2: UntypedFormGroup
  formGroupStepC2Optional = false
  @ViewChild('stepper') private myStepper: MatStepper

  constructor(
    private _cdref: ChangeDetectorRef,
    private _platformInfo: PlatformInfoService,
    private _formBuilder: UntypedFormBuilder,
    private _register: Register2Service,
    @Inject(WINDOW) private window: Window,
    private _googleTagManagerService: GoogleTagManagerService,
    private _router: Router,
    private _errorHandler: ErrorHandlerService,
    private _userInfo: UserService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    _platformInfo.get().subscribe((platform) => {
      this.platform = platform
      this.reactivation.isReactivation = this.platform.reactivation
      this.reactivation.reactivationCode = this.platform.reactivationCode

      this._registerObservabilityService.initializeJourney({
        isReactivation: this.reactivation.isReactivation,
        coulumn4: this.platform.columns4,
        column8: this.platform.columns8,
        column12: this.platform.columns12,
      })
    })
  }
  ngOnInit() {
    this._register.getRegisterForm().subscribe()

    this.FormGroupStepA = this._formBuilder.group({
      personal: [''],
    })
    this.FormGroupStepB = this._formBuilder.group({
      password: [''],
    })
    this.FormGroupStepC = this._formBuilder.group({
      activitiesVisibilityDefault: [''],
    })

    this.FormGroupStepC2 = this._formBuilder.group({
      affiliations: [''],
    })
    this.FormGroupStepD = this._formBuilder.group({
      sendOrcidNews: [''],
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
            this._registerObservabilityService.reportRegisterEvent(
              'prefill_register-form'
            )
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

  formGroupStepC2Next(nextOptional: boolean) {
    this.formGroupStepC2Optional = nextOptional
    this._cdref.detectChanges()
    this.myStepper.next()
  }

  register() {
    this.loading = true
    this.lastStep.interacted = true
    if (
      this.FormGroupStepA.valid &&
      this.FormGroupStepB.valid &&
      this.FormGroupStepC.valid &&
      this.FormGroupStepD.valid
    ) {
      this._register
        .backendRegisterFormValidate(
          this.FormGroupStepA,
          this.FormGroupStepB,
          this.FormGroupStepC,
          this.FormGroupStepC2,
          this.FormGroupStepD
        )
        .pipe(
          switchMap((validator: RegisterForm) => {
            this._registerObservabilityService.reportRegisterEvent(
              'register-validate',
              {
                validator,
              }
            )
            if (validator.errors.length > 0) {
              // At this point any backend error is unexpected
              this._errorHandler.handleError(
                new Error('registerUnexpectedValidateFail'),
                ERROR_REPORT.REGISTER
              )
              this._registerObservabilityService.reportRegisterErrorEvent(
                'register-validate',
                {
                  errors: validator.errors,
                }
              )
            }
            return this._register.register(
              this.FormGroupStepA,
              this.FormGroupStepB,
              this.FormGroupStepC,
              this.FormGroupStepC2,
              this.FormGroupStepD,
              this.reactivation,
              this.requestInfoForm
            )
          })
        )
        .subscribe((response) => {
          this.loading = false
          if (response.url) {
            this._registerObservabilityService.reportRegisterEvent(
              'register-confirmation',
              {
                response,
              }
            )

            const analyticsReports: Observable<void>[] = []

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
            this._registerObservabilityService.reportRegisterErrorEvent(
              'register-confirmation',
              {
                response,
              }
            )

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
  selectionChange(event: StepperSelectionEvent) {
    const step = ['a', 'b', 'c2', 'c', 'd'][event.selectedIndex] as JourneyType
    this._registerObservabilityService.stepLoaded(step)
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
      nextStep = this.stepComponentC2
    } else if (event.selectedIndex === 3) {
      nextStep = this.stepComponentC
    } else if (event.selectedIndex === 4) {
      nextStep = this.stepComponentD
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
