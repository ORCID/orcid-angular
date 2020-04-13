import {
  Component,
  OnInit,
  forwardRef,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core'
import { BaseForm } from '../BaseForm'
import {
  FormGroup,
  FormControl,
  Validators,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
} from '@angular/forms'
import { OrcidValidators } from 'src/app/validators'
import { RegisterService } from 'src/app/core/register/register.service'
import { HAS_NUMBER, HAS_LETTER_OR_SYMBOL } from 'src/app/constants'
import { RegisterForm } from 'src/app/types/register.endpoint'

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrls: ['./form-password.component.scss'],
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
})
export class FormPasswordComponent extends BaseForm implements OnInit {
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
    this.form.statusChanges.subscribe(value => {
      console.log('PASSWORD ERROR: ', this.form.controls['password'])
    })
  }

  passwordDoesNotContainUserEmails(): ValidatorFn {
    return (formGroup: FormGroup) => {
      console.log(' PASSWORD _ VALIDATOR')
      console.log(formGroup)
      console.log(this.personalData)
      return null
      // let hasError = false
      // const registerForm = this._register.formGroupToEmailRegisterForm(
      //   formGroup
      // )

      // const error = { backendErrors: { additionalEmails: {} } }

      // registerForm.emailsAdditional.forEach((additionalEmail, i) => {
      //   if (!error.backendErrors.additionalEmails[additionalEmail.value]) {
      //     error.backendErrors.additionalEmails[additionalEmail.value] = []
      //   }
      //   const additionalEmailsErrors = error.backendErrors.additionalEmails
      //   if (additionalEmail.value === registerForm.email.value) {
      //     hasError = true
      //     additionalEmailsErrors[additionalEmail.value] = [
      //       'additionalEmailCantBePrimaryEmail',
      //     ]
      //   } else {
      //     registerForm.emailsAdditional.forEach((element, i2) => {
      //       if (i !== i2 && additionalEmail.value === element.value) {
      //         hasError = true
      //         additionalEmailsErrors[additionalEmail.value] = [
      //           'duplicatedAdditionalEmail',
      //         ]
      //       }
      //     })
      //   }
      // })
      // if (hasError) {
      //   return error
      // } else {
      //   return null
      // }
    }
  }
}
