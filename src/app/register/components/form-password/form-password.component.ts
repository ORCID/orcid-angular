import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core'
import {
  FormControl,
  FormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { HAS_LETTER_OR_SYMBOL, HAS_NUMBER } from 'src/app/constants'
import { RegisterService } from 'src/app/core/register/register.service'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { OrcidValidators } from 'src/app/validators'

import { BaseForm } from '../BaseForm'

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrls: [
    './form-password.component.scss-theme.scss',
    './form-password.component.scss',
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
export class FormPasswordComponent extends BaseForm implements OnInit {
  labelInfo = $localize`:@@register.ariaLabelInfoPassword:info about password`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  @ViewChild(`#passwordPopover`) passwordPopover
  @ViewChild(`#passwordPopoverTrigger`) passwordPopoverTrigger
  hasNumberPatter = HAS_NUMBER
  hasLetterOrSymbolPatter = HAS_LETTER_OR_SYMBOL
  @Input() personalData: RegisterForm
  constructor(private _register: RegisterService) {
    super()
  }
  ngOnInit() {
    this.form = new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
            Validators.pattern(this.hasNumberPatter),
            Validators.pattern(this.hasLetterOrSymbolPatter),
            this.passwordDoesNotContainUserEmails(),
          ],
          asyncValidators: [this._register.backendValueValidate('password')],
        }),
        passwordConfirm: new FormControl('', Validators.required),
      },
      {
        validators: OrcidValidators.matchValues('password', 'passwordConfirm'),
        asyncValidators: this._register.backendPasswordValidate(),
      }
    )
  }

  passwordDoesNotContainUserEmails(): ValidatorFn {
    return (control: FormControl) => {
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
        this.form as FormGroup
      )

      fn(registerForm)
    })
  }
}
