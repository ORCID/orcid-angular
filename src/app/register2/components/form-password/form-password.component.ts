import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { HAS_LETTER_OR_SYMBOL, HAS_NUMBER } from 'src/app/constants'
import { Register2Service } from 'src/app/core/register2/register2.service'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { OrcidValidators } from 'src/app/validators'

import { BaseForm } from '../BaseForm'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { environment } from 'src/environments/environment'
import { RegisterObservabilityService } from '../../register-observability.service'
import { RegisterStateService } from '../../register-state.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrls: [
    './form-password.component.scss-theme.scss',
    './form-password.component.scss',
    '../register2.scss-theme.scss',
    '../register2.style.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPasswordComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormPasswordComponent),
      multi: true,
    },
  ],
  preserveWhitespaces: true,
})
export class FormPasswordComponent
  extends BaseForm
  implements OnInit, OnDestroy
{
  labelInfo = $localize`:@@register.ariaLabelInfoPassword:info about password`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  labelConfirmPassword = $localize`:@@register.confirmYourPassword:Confirm your password`

  accesibiltiyOnlyThe8OrMoreCharactersConstrainIsMet = $localize`:@@register.accesibiltiyOnlyThe8OrMoreCharactersConstrainIsMet:Your password must include at least 1 letter or symbol and 1 number`
  accesibiltiyOnlyTheLetterOrSymbolConstrainIsMet = $localize`:@@register.accesibiltiyOnlyTheLetterOrSymbolConstrainIsMet:Your password must be 8 or more characters and include at least 1 number`
  accesibiltiyOnlyTheNumberConstrainIsMet = $localize`:@@register.accesibiltiyOnlyTheNumberConstrainIsMet:Your password must be 8 or more characters and include at least 1 letter or symbol`
  accesibilityOnlyTheNumberConstrainIsNotMet = $localize`:@@register.accesibilityOnlyTheNumberConstrainIsNotMet:Your password must include at least 1 number`
  accesibilityOnlyTheLetterOrSymbolConstrainIsNotMet = $localize`:@@register.accesibilityOnlyTheLetterOrSymbolConstrainIsNotMet:Your password must include at least 1 letter or symbol`
  accesibilityOnlyThe8OrMoreCharactersConstrainIsNotMet = $localize`:@@register.accesibilityOnlyThe8OrMoreCharactersConstrainIsNotMet:Your password must be 8 or more characters`
  passwordIsRequired = $localize`:@@register.passwordRequired:A password is required`
  @ViewChild(`#passwordPopover`) passwordPopover
  @ViewChild(`#passwordPopoverTrigger`) passwordPopoverTrigger
  hasNumberPattern = HAS_NUMBER
  hasLetterOrSymbolPattern = HAS_LETTER_OR_SYMBOL
  @Input() personalData: RegisterForm
  nextButtonWasClicked: boolean

  currentValidate8orMoreCharactersStatus: boolean
  ccurentValidateAtLeastALetterOrSymbolStatus: boolean
  currentValidateAtLeastANumber: boolean
  passwordsValidAreValidAlreadyChecked: any
  _currentAccesibilityError: string
  destroy = new Subject()
  constructor(
    private _register: Register2Service,
    private _liveAnnouncer: LiveAnnouncer,
    private _changeDetectorRef: ChangeDetectorRef,
    private _registerObservability: RegisterObservabilityService,
    private _registerStateService: RegisterStateService
  ) {
    super()
  }
  ngOnInit() {
    this._registerStateService
      .getNextButtonClickFor('b')
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.nextButtonWasClicked = true
        this._registerObservability.stepBNextButtonClicked(this.form)
      })
    this.form = new UntypedFormGroup(
      {
        password: new UntypedFormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
            Validators.pattern(this.hasNumberPattern),
            Validators.pattern(this.hasLetterOrSymbolPattern),
            this.passwordDoesNotContainUserEmails(),
          ],
          asyncValidators: [this._register.backendValueValidate('password')],
        }),
        passwordConfirm: new UntypedFormControl('', Validators.required),
      },
      {
        validators: OrcidValidators.matchValues('password', 'passwordConfirm'),
        asyncValidators: this._register.backendPasswordValidate(),
      }
    )

    this.form.controls['password'].valueChanges.subscribe(() => {
      this._changeDetectorRef.detectChanges()
      this.passwordAccesbiltyError()
    })
  }

  passwordDoesNotContainUserEmails(): ValidatorFn {
    return (control: UntypedFormControl) => {
      const password: string = control.value
      let hasError = false

      if (this.personalData && password) {
        Object.keys(this.personalData.emailsAdditional).forEach((key) => {
          const additionalEmail = this.personalData.emailsAdditional[key].value
          if (password.indexOf(additionalEmail) >= 0) {
            hasError = true
          }
        })
      }

      if (
        this.personalData &&
        this.personalData.email &&
        password.indexOf(this.personalData.email.value) >= 0
      ) {
        hasError = true
      }

      if (hasError) {
        return { passwordIsEqualToTheEmail: true }
      } else {
        return null
      }
    }
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const registerForm = this._register.formGroupToPasswordRegisterForm(
        this.form as UntypedFormGroup
      )

      fn(registerForm)
    })
  }

  passwordAccesbiltyError() {
    if (this.form.controls['password'].pristine) {
      return
    }
    if (
      !this.currentValidate8orMoreCharactersStatus &&
      this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError =
        this.accesibiltiyOnlyThe8OrMoreCharactersConstrainIsMet
    } else if (
      this.currentValidate8orMoreCharactersStatus &&
      !this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError =
        this.accesibiltiyOnlyTheLetterOrSymbolConstrainIsMet
    } else if (
      this.currentValidate8orMoreCharactersStatus &&
      this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      !this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError =
        this.accesibiltiyOnlyTheNumberConstrainIsMet
    } else if (
      !this.currentValidate8orMoreCharactersStatus &&
      this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      !this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError =
        this.accesibilityOnlyTheLetterOrSymbolConstrainIsNotMet
    } else if (
      !this.currentValidate8orMoreCharactersStatus &&
      !this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError =
        this.accesibilityOnlyTheNumberConstrainIsNotMet
    } else if (
      this.currentValidate8orMoreCharactersStatus &&
      !this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      !this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError =
        this.accesibilityOnlyThe8OrMoreCharactersConstrainIsNotMet
    } else if (
      !this.currentValidate8orMoreCharactersStatus &&
      !this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      !this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError = ''
    } else if (
      this.currentValidate8orMoreCharactersStatus &&
      this.ccurentValidateAtLeastALetterOrSymbolStatus &&
      this.currentValidateAtLeastANumber
    ) {
      this.currentAccesibilityError = this.passwordIsRequired
    }
  }

  set currentAccesibilityError(value: string) {
    if (this._currentAccesibilityError === value) {
      return
    }
    this._currentAccesibilityError = value
    if (!value) {
      this._registerObservability.reportRegisterEvent('password_valid')
      this.announce(
        $localize`:@@register.allPasswordContrainsArMet:All password constraints are met`
      )
    } else {
      this.announce(value)
    }
  }

  get currentAccesibilityError() {
    return this._currentAccesibilityError
  }

  get confirmPasswordTouched() {
    return (
      this.form.controls['passwordConfirm'].touched || this.nextButtonWasClicked
    )
  }
  get passwordTouched() {
    return this.form.controls['password'].touched || this.nextButtonWasClicked
  }

  get confirmPasswordValid() {
    return this.form.controls['passwordConfirm'].valid
  }
  get passwordValid() {
    return this.form.controls['password'].valid
  }

  get passwordsValid() {
    const validStatus = this.confirmPasswordValid && this.passwordValid

    if (!this.passwordsValidAreValidAlreadyChecked && validStatus) {
      this._registerObservability.reportRegisterEvent('password_match')
      this.announce(
        $localize`:@@register.passwordAreValid:Your passwords match`
      )
    } else if (this.passwordsValidAreValidAlreadyChecked && !validStatus) {
      this.announce(
        $localize`:@@register.passwordAreNotValid:Your passwords do not match`
      )
    }
    this.passwordsValidAreValidAlreadyChecked = validStatus

    return validStatus
  }

  get validate8orMoreCharacters() {
    const status =
      this.form.hasError('required', 'password') ||
      this.form.hasError('minlength', 'password')

    this.currentValidate8orMoreCharactersStatus = status

    return status
  }

  get validateAtLeastALetterOrSymbol() {
    const status =
      !(this.form.value?.password as string).trim().length ||
      this.form.hasError('required', 'password') ||
      this.form.getError('pattern', 'password')?.requiredPattern ==
        this.hasLetterOrSymbolPattern

    this.ccurentValidateAtLeastALetterOrSymbolStatus = status

    return status
  }

  get validateAtLeastANumber() {
    const status =
      !(this.form.value?.password as string).trim().length ||
      this.form.hasError('required', 'password') ||
      this.form.getError('pattern', 'password')?.requiredPattern ==
        this.hasNumberPattern
    this.currentValidateAtLeastANumber = status
    return status
  }

  private announce(announcement: string) {
    if (runtimeEnvironment.debugger) {
      console.debug('📢' + announcement)
    }
    this._liveAnnouncer.announce(announcement, 'assertive')
  }

  ngOnDestroy(): void {
    this.destroy.next()
  }
}
