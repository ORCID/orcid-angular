import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
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
} from 'rxjs/operators'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseForm } from '../BaseForm'
import { ErrorStateMatcher } from '@angular/material/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { Router } from '@angular/router'
import { ApplicationRoutes } from 'src/app/constants'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { environment } from 'src/environments/environment'
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
export class FormPersonalComponent extends BaseForm implements OnInit {
  matcher = new MyErrorStateMatcher()
  maxNameLenght = 100
  @Input() nextButtonWasClicked: boolean
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
  constructor(
    private _register: Register2Service,
    private _reactivationService: ReactivationService,
    private _platform: PlatformInfoService,
    private _router: Router,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    super()
  }

  emails: UntypedFormGroup = new UntypedFormGroup({})
  additionalEmails: UntypedFormGroup = new UntypedFormGroup({
    '0': new UntypedFormControl('', {
      validators: [OrcidValidators.email],
    }),
  })

  ngOnInit() {
    this.emails = new UntypedFormGroup(
      {
        email: new UntypedFormControl('', {
          validators: [Validators.required, OrcidValidators.email],
          asyncValidators: this._register.backendValueValidate('email'),
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
          Validators.maxLength(this.maxNameLenght),
        ],
        asyncValidators: this._register.backendValueValidate('givenNames'),
      }),
      familyNames: new UntypedFormControl('', {
        validators: [OrcidValidators.illegalName],
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
      .valid
  }

  get givenNameFormTouched() {
    return this.form.controls.givenNames?.touched || this.nextButtonWasClicked
  }

  get emailsAreValid() {
    const validStatus = this.emailConfirmationValid && this.emailValid
    if (!this.emailsAreValidAlreadyChecked && validStatus) {
      this.announce($localize`:@@register.emailAreValid:Your emails match`)
    } else if (this.emailsAreValidAlreadyChecked && !validStatus) {
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
        backendError[0] === 'orcid.frontend.verify.duplicate_email' &&
        !this.nextButtonWasClicked
      )
    }
    return false
  }

  private announce(announcement: string) {
    if (environment.debugger) {
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
}
