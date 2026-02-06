import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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
  @Input() twoFactorState: boolean
  @Output() loading = new EventEmitter<boolean>()
  @ViewChild(AuthChallengeComponent)
  authChallengeComponent: AuthChallengeComponent
  errors: string[]
  success: boolean
  $destroy = new Subject<void>()
  currentValidate8orMoreCharactersStatus: boolean
  ccurentValidateAtLeastALetterOrSymbolStatus: boolean
  currentValidateAtLeastANumber: boolean
  confirmPasswordPlaceholder = $localize`:@@accountSettings.security.password.confirmPasswordPlaceholder:Confirm your new password`
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()

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
        twoFactorCode: new UntypedFormControl(null, [
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
        twoFactorRecoveryCode: new UntypedFormControl(null, [
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      },
      {
        validators: OrcidValidators.matchValues('password', 'retypedPassword'),
      }
    )
  }

  save() {
    this.form.markAllAsTouched()
    this.success = false

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
          } else if (value.errors && value.errors.length > 0) {
            this.form.controls['oldPassword'].setErrors({
              backendErrors: value.errors || null,
            })
          }
        })
    }
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
      !(this.form.value?.password as string)?.trim().length ||
      this.form.hasError('required', 'password') ||
      this.form.getError('pattern', 'password')?.requiredPattern ==
        this.hasLetterOrSymbolPattern

    this.ccurentValidateAtLeastALetterOrSymbolStatus = status

    return status
  }

  get validateAtLeastANumber() {
    const status =
      !(this.form.value?.password as string)?.trim().length ||
      this.form.hasError('required', 'password') ||
      this.form.getError('pattern', 'password')?.requiredPattern ==
        this.hasNumberPattern
    this.currentValidateAtLeastANumber = status
    return status
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
