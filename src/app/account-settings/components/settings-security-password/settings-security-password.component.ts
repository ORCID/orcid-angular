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
import { Subject, takeUntil } from 'rxjs'
import { HAS_LETTER_OR_SYMBOL, HAS_NUMBER } from 'src/app/constants'
import { AccountSecurityPasswordService } from 'src/app/core/account-security-password/account-security-password.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { OrcidValidators } from 'src/app/validators'
import {
  AUTH_CHALLENGE_HEADING_ID,
  AuthChallengeComponent,
} from '@orcid/registry-ui'
import { ErrorStateMatcherForTwoFactorFields } from '../../../sign-in/ErrorStateMatcherForTwoFactorFields'
import { MatDialog } from '@angular/material/dialog'
import { AuthChallengeFormData } from '../../../types/common.endpoint'
import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'

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
  cancel: boolean
  $destroy = new Subject<void>()
  currentValidate8orMoreCharactersStatus: boolean
  currentValidateAtLeastALetterOrSymbolStatus: boolean
  currentValidateAtLeastANumber: boolean
  confirmPasswordPlaceholder = $localize`:@@accountSettings.security.password.confirmPasswordPlaceholder:Confirm your new password`
  authChallengeLabel = $localize`:@@accountSettings.security.password.authChallengeLabel:to complete your password reset`
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()

  constructor(
    private _fb: UntypedFormBuilder,
    private _register: RegisterService,
    private _accountPassword: AccountSecurityPasswordService,
    private _dialog: MatDialog,
    private _recoveryPhoneChallenge: RecoveryPhoneChallengeService
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
        twoFactorRecoveryPhoneCode: new UntypedFormControl(null, [
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
      },
      {
        validators: OrcidValidators.matchValues('password', 'retypedPassword'),
      }
    )
  }

  openAuthChallenge() {
    // If the user answers with a recovery phone number code the registry turns
    // 2FA off before it answers (R5.3), so by the time `submitAttempt` fires
    // the password on its own is enough and the update below just proceeds.
    const recoveryPhone = this._recoveryPhoneChallenge.create()
    const dialogRef = this._dialog.open<AuthChallengeComponent>(
      AuthChallengeComponent,
      {
        // The challenge names itself from its own heading, so the dialog and
        // the panel it opens are one string rather than two.
        ariaLabelledBy: AUTH_CHALLENGE_HEADING_ID,
        data: {
          ...({
            parentForm: this.form,
            showPasswordField: false,
            // This form's `password` is the *new* password being chosen; the
            // account password - the one the challenge exists to prove - is
            // `oldPassword`, and that is what a recovery phone verify posts.
            passwordControlName: 'oldPassword',
            actionDescription: this.authChallengeLabel,
          } as AuthChallengeFormData),
          recoveryPhone,
        },
      }
    )

    dialogRef.componentInstance.submitAttempt
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        this._accountPassword.updatePassword(this.form.value).subscribe({
          next: (response: any) => {
            if (response.success) {
              dialogRef.close(true)
            } else {
              dialogRef.componentInstance.loading = false
              dialogRef.componentInstance.processBackendResponse(response)
            }
          },
        })
      })

    dialogRef.afterClosed().subscribe((success) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      this.form.reset()
      if (success) {
        this.success = true
      } else {
        this.cancel = true
      }
    })
  }

  save() {
    this.form.markAllAsTouched()
    this.success = false
    this.cancel = false
    if (this.form.valid) {
      this.loading.emit(true)
      this._accountPassword
        .updatePassword(this.form.value)
        .subscribe((value) => {
          this.loading.emit(false)
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
            if (value.errors && value.errors.length > 0) {
              this.form.controls['oldPassword'].setErrors({
                backendErrors: value.errors || null,
              })
            } else if (value.twoFactorEnabled && !value.passwordContainsEmail) {
              this.openAuthChallenge()
            }
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

    this.currentValidateAtLeastALetterOrSymbolStatus = status

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
    this.form?.reset()
    this.$destroy.next()
    this.$destroy.complete()
  }
}
