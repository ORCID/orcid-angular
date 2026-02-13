import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { Subject } from 'rxjs'
import { HAS_LETTER_OR_SYMBOL, HAS_NUMBER } from 'src/app/constants'
import { AccountSecurityPasswordService } from 'src/app/core/account-security-password/account-security-password.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { OrcidValidators } from 'src/app/validators'
import { AuthChallengeComponent } from '@orcid/ui'
import { ErrorStateMatcherForTwoFactorFields } from '../../../sign-in/ErrorStateMatcherForTwoFactorFields'

@Component({
  selector: 'app-settings-security-password',
  templateUrl: './settings-security-password.component.html',
  styleUrls: [
    './settings-security-password.component.scss',
    './settings-security-password.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsSecurityPasswordComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup
  hasNumberPattern = HAS_NUMBER
  hasLetterOrSymbolPattern = HAS_LETTER_OR_SYMBOL
  @Output() loading = new EventEmitter<boolean>()
  @ViewChild(AuthChallengeComponent)
  authChallengeComponent: AuthChallengeComponent
  errors: string[]
  success: boolean
  $destroy = new Subject<void>()

  constructor(
    private _fb: UntypedFormBuilder,
    private _register: RegisterService,
    private _accountPassword: AccountSecurityPasswordService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group(
      {
        oldPassword: ['', Validators.required],
        password: new UntypedFormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
            Validators.pattern(this.hasNumberPattern),
            Validators.pattern(this.hasLetterOrSymbolPattern),
          ],
          asyncValidators: [this._register.backendValueValidate('password')],
        }),
        retypedPassword: new UntypedFormControl('', Validators.required),
      },
      {
        validators: OrcidValidators.matchValues('password', 'retypedPassword'),
      }
    )
  }

  save() {
    if (this.form.valid) {
      this.loading.emit(true)
      this._accountPassword
        .updatePassword(this.form.value)
        .subscribe((value) => {
          this.loading.emit(false)
          this.authChallengeComponent?.processBackendResponse(value)
          if (value.passwordContainsEmail) {
            this.form.controls['password']?.setErrors({ containsEmail: true })
          }
          if (value.success) {
            setTimeout(() => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
                this.form.reset()
              }
            })
            this.success = true
          } else {
            this.form.controls['oldPassword'].setErrors({
              backendErrors: value.errors || null,
            })
          }
        })
    }
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
