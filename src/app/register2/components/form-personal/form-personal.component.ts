import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  FormControl,
  FormGroupDirective,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Register2Service } from 'src/app/core/register2/register2.service'
import { OrcidValidators } from 'src/app/validators'

import {
  debounce,
  debounceTime,
  filter,
  first,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseForm } from '../BaseForm'
import { ErrorStateMatcher } from '@angular/material/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { Router } from '@angular/router'
import {
  ApplicationRoutes,
  MAX_LENGTH_LESS_THAN_ONE_HUNDRED,
} from 'src/app/constants'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { environment } from 'src/environments/environment'
import { RegisterBackendErrors } from 'src/app/types/register.local'
import { WINDOW } from 'src/app/cdk/window'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { ERROR_REPORT } from 'src/app/errors'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'
import { Subject } from 'rxjs'
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    )
  }
}

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: [
    './form-personal.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPersonalComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormPersonalComponent),
      multi: true,
    },
  ],
})
export class FormPersonalComponent
  extends BaseForm
  implements OnInit, OnDestroy
{
  matcher = new MyErrorStateMatcher()
  @Input() reactivation: ReactivationLocal
  @ViewChild(FormGroupDirective) formGroupDir: FormGroupDirective
  emailPlaceholder = $localize`:@@register.emailPlaceholder:The email address you use most`
  arialabelConfirmEmail = $localize`:@@register.labelConfirmEmail:Confirm your email address`
  labelInfoAboutName = $localize`:@@register.ariaLabelInfo:info about names`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  labelConfirmEmail = $localize`:@@register.confirmEmail:Confirm primary email`
  labelNameYouMostCommonly = $localize`:@@register.labelNameYouMostMost:The names you most commonly go by`
  labelFamilyNamePlaceholder = $localize`:@@register.familyNamePlaceholder:Your family name or surname
  `
  professionalEmail: boolean
  personalEmail: boolean
  undefinedEmail: boolean
  emailsAreValidAlreadyChecked: boolean
  registerBackendErrors: RegisterBackendErrors
  nextButtonWasClicked: boolean
  destroy = new Subject()

  constructor(
    private _register: Register2Service,
    private _reactivationService: ReactivationService,
    private _platform: PlatformInfoService,
    private _router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackbar: SnackbarService,
    private _signIn: SignInService,
    private _errorHandler: ErrorHandlerService,
    private _registerStateService: RegisterStateService,
    @Inject(WINDOW) private window: Window,
    private _registerObservability: RegisterObservabilityService
  ) {
    super()
  }
  ngOnDestroy(): void {
    this.destroy.next()
  }

  emails: UntypedFormGroup = new UntypedFormGroup({})
  additionalEmails: UntypedFormGroup = new UntypedFormGroup({
    '0': new UntypedFormControl('', {
      validators: [OrcidValidators.email],
      asyncValidators: this._register.backendValueValidate('email'),
    }),
  })

  ngOnInit() {
    this._registerStateService
      .getNextButtonClickFor('a')
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.nextButtonWasClicked = true
        this._registerObservability.stepANextButtonClicked(this.form)
      })
    this.emails = new UntypedFormGroup(
      {
        email: new UntypedFormControl('', {
          validators: [Validators.required, OrcidValidators.email],
          asyncValidators:
            !this.reactivation?.isReactivation &&
            this._register.backendValueValidate('email'),
        }),
        additionalEmails: this.additionalEmails,
      },
      {
        validators: [
          OrcidValidators.matchValues('email', 'confirmEmail', false),
          this.allEmailsAreUnique(),
        ],
        asyncValidators: [
          this._register.backendAdditionalEmailsValidate(
            this.reactivation?.isReactivation
          ),
        ],
        updateOn: 'change',
      }
    )

    this.additionalEmails.controls[0].valueChanges
      .pipe(
        debounceTime(1000),
        filter(() => !this.additionalEmails.controls[0].errors),
        switchMap((value) => {
          const emailDomain = value.split('@')[1]
          return this._register.getEmailCategory(emailDomain)
        })
      )
      .subscribe((value) => {
        this._registerStateService.setRorAffiliationFound(value.rorId, true)
      })

    this.emails.controls['email'].valueChanges
      .pipe(
        debounceTime(1000),
        filter(() => !this.emails.controls['email'].errors),
        switchMap((value) => {
          const emailDomain = value.split('@')[1]
          return this._register.getEmailCategory(emailDomain)
        })
      )
      .subscribe((value) => {
        this.professionalEmail = value.category === 'PROFESSIONAL'
        this.personalEmail = value.category === 'PERSONAL'
        this.undefinedEmail = value.category === 'UNDEFINED'
        this._registerStateService.setRorAffiliationFound(value.rorId)
      })

    if (!this.reactivation?.isReactivation) {
      this.emails.addControl(
        'confirmEmail',
        new UntypedFormControl('', {
          validators: [Validators.required, OrcidValidators.email],
        })
      )
    }

    this.form = new UntypedFormGroup({
      givenNames: new UntypedFormControl('', {
        validators: [
          Validators.required,
          OrcidValidators.illegalName,
          Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_HUNDRED),
        ],
      }),
      familyNames: new UntypedFormControl('', {
        validators: [
          OrcidValidators.illegalName,
          Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_HUNDRED),
        ],
      }),
      emails: this.emails,
    })

    if (this.reactivation?.isReactivation) {
      this._reactivationService
        .getReactivationData(this.reactivation.reactivationCode)
        .pipe(first())
        .subscribe((reactivation) => {
          this.emails.patchValue({
            email: reactivation.email,
          })
          this.emails.controls['email'].disable()
        })
    }
  }

  allEmailsAreUnique(): ValidatorFn {
    return (formGroup: UntypedFormGroup) => {
      let hasError = false
      const registerForm =
        this._register.formGroupToEmailRegisterForm(formGroup)

      const error = { backendErrors: { additionalEmails: {} } }

      Object.keys(registerForm.emailsAdditional).forEach((key, i) => {
        const additionalEmail = registerForm.emailsAdditional[key]
        if (!error.backendErrors.additionalEmails[additionalEmail.value]) {
          error.backendErrors.additionalEmails[additionalEmail.value] = []
        }
        const additionalEmailsErrors = error.backendErrors.additionalEmails
        if (
          registerForm.email &&
          additionalEmail.value === registerForm.email.value
        ) {
          hasError = true
          additionalEmailsErrors[additionalEmail.value] = [
            'additionalEmailCantBePrimaryEmail',
          ]
        } else {
          Object.keys(registerForm.emailsAdditional).forEach(
            (elementKey, i2) => {
              const element = registerForm.emailsAdditional[elementKey]
              if (i !== i2 && additionalEmail.value === element.value) {
                hasError = true
                additionalEmailsErrors[additionalEmail.value] = [
                  'duplicatedAdditionalEmail',
                ]
              }
            }
          )
        }
      })

      if (hasError) {
        return error
      } else {
        return null
      }
    }
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const emailsForm = this._register.formGroupToEmailRegisterForm(
        this.form.controls['emails'] as UntypedFormGroup
      )
      const namesForm =
        this._register.formGroupToNamesRegisterForm(this.form) || {}

      fn({ ...emailsForm, ...namesForm })
    })
  }

  get emailFormTouched() {
    return (
      ((this.form.controls.emails as any).controls?.email as any)?.touched ||
      this.nextButtonWasClicked
    )
  }

  get emailConfirmationFormTouched() {
    return (
      ((this.form.controls.emails as any).controls?.confirmEmail as any)
        ?.touched || this.nextButtonWasClicked
    )
  }

  get familyNamesFormTouched() {
    return this.form.controls.familyNames?.touched || this.nextButtonWasClicked
  }

  get emailValid() {
    return ((this.form.controls.emails as any).controls?.email as any).valid
  }

  get emailConfirmationValid() {
    return ((this.form.controls.emails as any).controls?.confirmEmail as any)
      ?.valid
  }

  get givenNameFormTouched() {
    return this.form.controls.givenNames?.touched || this.nextButtonWasClicked
  }

  get emailsAreValid() {
    const validStatus = this.emailConfirmationValid && this.emailValid
    if (!this.emailsAreValidAlreadyChecked && validStatus) {
      this.announce($localize`:@@register.emailAreValid:Your emails match`)
      this._registerObservability.reportRegisterEvent('emails_match')
    } else if (this.emailsAreValidAlreadyChecked && !validStatus) {
      this._registerObservability.reportRegisterEvent('emails_do_not_match')
      this.announce(
        $localize`:@@register.emailAreNotValid:Your emails do not match`
      )
    }
    this.emailsAreValidAlreadyChecked = validStatus
    return validStatus
  }

  get emailError(): boolean {
    if (this.emailFormTouched && this.emails.controls.email.errors) {
      const backendError = this.emails.controls.email.errors?.backendError
      return !(
        backendError &&
        (backendError[0] === 'orcid.frontend.verify.duplicate_email' ||
          backendError[0] === 'orcid.frontend.verify.unclaimed_email' ||
          backendError[0] === 'orcid.frontend.verify.deactivated_email') &&
        !this.nextButtonWasClicked
      )
    }
    return false
  }

  private announce(announcement: string) {
    if (runtimeEnvironment.debugger) {
      console.debug('📢' + announcement)
    }
    this._liveAnnouncer.announce(announcement, 'assertive')
  }

  navigateToSignin(email) {
    this._platform
      .get()
      .pipe(take(1))
      .subscribe((platform) => {
        return this._router.navigate([ApplicationRoutes.signin], {
          // keeps all parameters to support Oauth request
          // and set show login to true
          queryParams: { ...platform.queryParameters, email, show_login: true },
        })
      })
  }

  navigateToClaim(email) {
    email = encodeURIComponent(email)
    this.window.location.href = `/resend-claim?email=${email}`
  }

  reactivateEmail(email) {
    const $deactivate = this._signIn.reactivation(email)
    $deactivate.subscribe((data) => {
      if (data.error) {
        this._errorHandler
          .handleError(
            new Error(data.error),
            ERROR_REPORT.REGISTER_REACTIVATED_EMAIL
          )
          .subscribe()
      } else {
        this._snackbar.showSuccessMessage({
          title: $localize`:@@register.reactivating:Reactivating your account`,
          // tslint:disable-next-line: max-line-length
          message: $localize`:@@ngOrcid.signin.verify.reactivationSent:Thank you for reactivating your ORCID record; please complete the process by following the steps in the email we are now sending you. If you don’t receive an email from us, please`,
          action: $localize`:@@shared.contactSupport:contact support.`,
          actionURL: `https://support.orcid.org/`,
          closable: true,
        })
        this._router.navigate([ApplicationRoutes.signin])
      }
    })
  }
}
