import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  Optional,
} from '@angular/core'
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { ErrorStateMatcher } from '@angular/material/core'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { Subscription } from 'rxjs'

import {
  AUTH_CHALLENGE_HEADING_ID,
  AuthChallengeRecoveryPhone,
  AuthChallengeRecoveryPhoneVerification,
} from './auth-challenge.types'

class ErrorStateMatcherForTwoFactorFields implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched)
  }
}

@Component({
  selector: 'app-auth-challenge',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './auth-challenge.component.html',
  styleUrls: [
    './auth-challenge.component.scss',
    './auth-challenge.component.scss-theme.scss',
  ],
})
export class AuthChallengeComponent implements OnInit, OnDestroy {
  @ViewChild('passwordInput') passwordInput!: ElementRef
  @ViewChild('twoFactorCodeInput') twoFactorCodeInput!: ElementRef
  @ViewChild('twoFactorRecoveryCodeInput')
  twoFactorRecoveryCodeInput!: ElementRef
  @ViewChild('twoFactorRecoveryPhoneCodeInput')
  twoFactorRecoveryPhoneCodeInput!: ElementRef

  @Output() submitAttempt = new EventEmitter<void>()
  @Output() cancelAttempt = new EventEmitter<void>()

  @Input() parentForm!: FormGroup
  @Input() codeControlName = 'twoFactorCode'
  @Input() recoveryControlName = 'twoFactorRecoveryCode'
  /**
   * The control that holds the *account* password - the credential this
   * challenge exists to prove. A host that collects it somewhere else has to
   * say which one it is: see `knowsWhichPasswordToRead`.
   */
  @Input()
  set passwordControlName(name: string) {
    this._passwordControlName = name
    this.passwordControlWasNamed = true
  }
  get passwordControlName(): string {
    return this._passwordControlName
  }
  private _passwordControlName = 'password'
  private passwordControlWasNamed = false
  @Input() showPasswordField = true
  @Input() showTwoFactorField = true
  @Input() actionDescription = ''
  @Input() boldText = ''
  @Input() trailingText = ''

  /**
   * The recovery phone number option, resolved and driven by the host. Absent
   * - or present but unavailable - leaves the challenge exactly as it was.
   */
  @Input() recoveryPhone?: AuthChallengeRecoveryPhone
  @Input() recoveryPhoneControlName = 'twoFactorRecoveryPhoneCode'

  invalidPassword = false
  invalidTwoFactorCode = false
  invalidTwoFactorRecoveryCode = false
  showRecoveryCode = false
  /** The third mode: a code sent by text instead of a code from the app. */
  showRecoveryPhoneCode = false
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()
  loading = false
  /**
   * True only while a recovery phone number code is with the registry. That
   * request is the one thing here that cannot be taken back, so the cancel
   * control is held shut for as long as it is outstanding (R5.4).
   */
  verifying = false

  /** Named on the heading so a dialog host can point `ariaLabelledBy` at it. */
  readonly headingId = AUTH_CHALLENGE_HEADING_ID

  private verification: Subscription | undefined
  private closeWasAlreadyDisabled = false

  constructor(
    // Make dialog dependencies optional
    @Optional() private matRef: MatDialogRef<AuthChallengeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Only execute dialog-specific logic if matRef exists
    if (this.matRef) {
      this.matRef.updateSize('580px')
    }
  }

  ngOnInit() {
    // If opened via dialog, override inputs with dialog data
    if (this.data) {
      this.parentForm = this.data.parentForm || this.parentForm
      this.codeControlName = this.data.codeControlName ?? this.codeControlName
      this.recoveryControlName =
        this.data.recoveryControlName ?? this.recoveryControlName
      // Assigned only when the host actually said so: going through the
      // setter otherwise would count the default as an answer.
      if (this.data.passwordControlName) {
        this.passwordControlName = this.data.passwordControlName
      }
      this.showPasswordField =
        this.data.showPasswordField ?? this.showPasswordField
      this.showTwoFactorField =
        this.data.showTwoFactorField ?? this.showTwoFactorField
      this.actionDescription =
        this.data.actionDescription ?? this.actionDescription
      this.boldText = this.data.boldText ?? this.boldText
      this.trailingText = this.data.trailingText ?? this.trailingText
      this.recoveryPhone = this.data.recoveryPhone ?? this.recoveryPhone
      this.recoveryPhoneControlName =
        this.data.recoveryPhoneControlName ?? this.recoveryPhoneControlName
    }

    if (this.showPasswordField) {
      this.parentForm?.get(this.passwordControlName)?.setValue(null)
      this.parentForm?.get(this.passwordControlName)?.markAsUntouched()
    }

    this.parentForm?.get(this.codeControlName)?.markAsUntouched()
    this.parentForm?.get(this.recoveryControlName)?.markAsUntouched()
    this.parentForm?.get(this.recoveryPhoneControlName)?.markAsUntouched()
    this.updateTwoFactorValidators()
  }

  get passwordWasTouched() {
    return this.parentForm?.get(this.passwordControlName)?.touched
  }

  get twoFactorCodeWasTouched() {
    return this.parentForm?.get(this.codeControlName)?.touched
  }

  get twoFactorRecoveryCodeWasTouched() {
    return this.parentForm?.get(this.recoveryControlName)?.touched
  }

  get twoFactorRecoveryPhoneCodeWasTouched() {
    return this.parentForm?.get(this.recoveryPhoneControlName)?.touched
  }

  /** Whether the option is worth offering at all (R5.1). */
  get recoveryPhoneAvailable(): boolean {
    return !!this.recoveryPhone?.available && this.knowsWhichPasswordToRead
  }

  /**
   * Answering with a recovery phone number code posts the account password
   * straight to the registry, so the challenge has to be certain which control
   * holds it.
   *
   * When it collects the password itself, the answer is the field it just
   * filled, whatever that control is called. When a host collects it elsewhere
   * and only hands over a form, `password` is a guess - in the change-password
   * form it is the *new* password the user is choosing - so the host has to
   * name the control. Until it does, the option is not offered: the rest of
   * the challenge still works, and nothing posts a credential the user never
   * meant as their account password.
   */
  private get knowsWhichPasswordToRead(): boolean {
    if (!this.showPasswordField && !this.passwordControlWasNamed) {
      return false
    }
    return !!this.parentForm?.get(this.passwordControlName)
  }

  onSubmit() {
    this.loading = true
    this.parentForm?.markAllAsTouched()

    if (this.showRecoveryPhoneCode && this.recoveryPhone) {
      this.verifyRecoveryPhoneCode(this.recoveryPhone)
      return
    }

    this.submitAttempt.emit()
  }

  onCancel() {
    if (this.verifying) {
      // Nothing to cancel back to: see verifyRecoveryPhoneCode. The control is
      // disabled too; this guards a host that calls the method itself.
      return
    }
    if (this.matRef) {
      this.matRef.close()
    }
    this.cancelAttempt.emit()
  }

  toggleRecoveryCode(event: Event) {
    event.preventDefault()
    this.showRecoveryCode = !this.showRecoveryCode

    if (this.showRecoveryCode) {
      setTimeout(() => {
        this.twoFactorRecoveryCodeInput?.nativeElement.focus()
      })
      this.parentForm?.get(this.codeControlName)?.setValue(null)
      this.parentForm?.get(this.recoveryControlName)?.markAsUntouched()
    } else {
      setTimeout(() => {
        this.twoFactorCodeInput?.nativeElement.focus()
      })
      this.parentForm?.get(this.recoveryControlName)?.setValue(null)
      this.parentForm?.get(this.codeControlName)?.markAsUntouched()
    }
    this.updateTwoFactorValidators()
  }

  /**
   * Asks for a text and switches to the code field it will be typed into. The
   * switch happens whether or not the send succeeds, so a failure is reported
   * on the screen the user is now looking at rather than behind them.
   */
  sendRecoveryPhoneCode(event: Event) {
    event.preventDefault()
    if (!this.recoveryPhoneAvailable) {
      return
    }

    this.showRecoveryPhoneCode = true
    this.parentForm?.get(this.codeControlName)?.setValue(null)
    this.parentForm?.get(this.recoveryControlName)?.setValue(null)
    this.parentForm?.get(this.recoveryPhoneControlName)?.markAsUntouched()
    this.updateTwoFactorValidators()

    setTimeout(() => {
      this.twoFactorRecoveryPhoneCodeInput?.nativeElement.focus()
    })

    this.recoveryPhone?.sendCode()
  }

  /** Asks for another text once the registry's resend buffer has run out. */
  resendRecoveryPhoneCode(event: Event) {
    event.preventDefault()
    this.parentForm?.get(this.recoveryPhoneControlName)?.setValue(null)
    this.parentForm?.get(this.recoveryPhoneControlName)?.markAsUntouched()
    this.recoveryPhone?.sendCode()
  }

  /**
   * Leave the phone code for a recovery code, which is what the frames offer as
   * the way out of this mode (1160:12657 and the three challenge error frames).
   *
   * The route back to the authentication app is still there, one step further
   * on: the recovery-code screen's own escape is "Use your authentication app
   * instead". What must not happen is this row disappearing, which is what the
   * comment in the template's cap branch is about.
   */
  useRecoveryCode(event: Event) {
    event.preventDefault()
    this.showRecoveryPhoneCode = false
    this.showRecoveryCode = true
    this.parentForm?.get(this.recoveryPhoneControlName)?.setValue(null)
    this.parentForm?.get(this.recoveryControlName)?.markAsUntouched()
    this.updateTwoFactorValidators()

    setTimeout(() => {
      this.twoFactorRecoveryCodeInput?.nativeElement.focus()
    })
  }

  /** Back out of the phone code and use the authentication app after all. */
  useAuthenticationApp(event: Event) {
    event.preventDefault()
    this.showRecoveryPhoneCode = false
    this.showRecoveryCode = false
    this.parentForm?.get(this.recoveryPhoneControlName)?.setValue(null)
    this.parentForm?.get(this.codeControlName)?.markAsUntouched()
    this.updateTwoFactorValidators()

    setTimeout(() => {
      this.twoFactorCodeInput?.nativeElement.focus()
    })
  }

  /**
   * Verifying a recovery phone number code is not the same as answering the
   * challenge: the registry disables 2FA, deletes the number and invalidates
   * the backup codes before it answers (R3.5, reached through R5.3). Only once
   * that has happened may the host run the action it was guarding, and only
   * because the password alone is now enough. So `submitAttempt` is held back
   * until the code has been accepted, and the code fields are emptied first so
   * the host posts a password and nothing else.
   */
  private verifyRecoveryPhoneCode(
    recoveryPhone: AuthChallengeRecoveryPhone
  ): void {
    const password = this.parentForm?.get(this.passwordControlName)?.value
    const code = this.parentForm?.get(this.recoveryPhoneControlName)?.value

    this.verification?.unsubscribe()
    this.startVerifying()
    this.verification = recoveryPhone.verify(password, code).subscribe({
      next: (result: AuthChallengeRecoveryPhoneVerification) => {
        this.stopVerifying()

        if (result === 'invalidPassword') {
          // The registry checks the password before the code, so no attempt
          // was spent and the code the user typed is still good. Report it
          // where the ordinary path reports it, on the password.
          this.processBackendResponse({ invalidPassword: true })
          return
        }

        if (result !== 'passed') {
          this.loading = false
          this.parentForm
            ?.get(this.recoveryPhoneControlName)
            ?.setErrors({ invalid: true })
          return
        }

        recoveryPhone.used = true
        this.clearTwoFactorCodes()
        this.submitAttempt.emit()
      },
      error: () => {
        this.stopVerifying()
        this.loading = false
        this.parentForm
          ?.get(this.recoveryPhoneControlName)
          ?.setErrors({ invalid: true })
      },
    })
  }

  /**
   * Shuts the ways out for as long as the registry is deciding. A pass has
   * already disabled 2FA, deleted the number and voided the backup codes by
   * the time it answers (R5.3), and walking away aborts the request without
   * undoing any of that: the user would be left with none of it and no idea.
   */
  private startVerifying(): void {
    this.verifying = true
    if (this.matRef) {
      this.closeWasAlreadyDisabled = this.matRef.disableClose === true
      this.matRef.disableClose = true
    }
  }

  private stopVerifying(): void {
    this.verifying = false
    if (this.matRef) {
      this.matRef.disableClose = this.closeWasAlreadyDisabled
    }
  }

  /**
   * Empties every code field and drops the requirement to fill one in: with
   * 2FA off there is no longer a code to give, and a control left required
   * would keep the form invalid for an action that no longer needs it.
   */
  private clearTwoFactorCodes(): void {
    ;[
      this.codeControlName,
      this.recoveryControlName,
      this.recoveryPhoneControlName,
    ].forEach((name) => {
      const control = this.parentForm?.get(name)
      control?.setValue(null)
      control?.removeValidators(Validators.required)
      control?.markAsUntouched()
      control?.updateValueAndValidity({ emitEvent: false })
    })
  }

  private updateTwoFactorValidators() {
    const twoFactorCodeControl = this.parentForm?.get(this.codeControlName)
    const recoveryCodeControl = this.parentForm?.get(this.recoveryControlName)
    const recoveryPhoneCodeControl = this.parentForm?.get(
      this.recoveryPhoneControlName
    )

    if (!this.showTwoFactorField) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
      recoveryPhoneCodeControl?.removeValidators(Validators.required)
    } else if (this.showRecoveryPhoneCode) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
      recoveryPhoneCodeControl?.addValidators(Validators.required)
    } else if (this.showRecoveryCode) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.addValidators(Validators.required)
      recoveryPhoneCodeControl?.removeValidators(Validators.required)
    } else {
      twoFactorCodeControl?.addValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
      recoveryPhoneCodeControl?.removeValidators(Validators.required)
    }

    twoFactorCodeControl?.updateValueAndValidity()
    recoveryCodeControl?.updateValueAndValidity()
    recoveryPhoneCodeControl?.updateValueAndValidity()
  }

  processBackendResponse(value: any) {
    this.loading = false

    const codeControl = this.parentForm?.get(this.codeControlName)
    const recoveryControl = this.parentForm?.get(this.recoveryControlName)
    const passwordControl = this.parentForm?.get(this.passwordControlName)

    if (value.invalidPassword) {
      this.passwordInput?.nativeElement.focus()
      passwordControl?.setErrors({ invalid: true })
      codeControl?.setValue(null)
      codeControl?.markAsUntouched()
      recoveryControl?.setValue(null)
      recoveryControl?.markAsUntouched()
    } else {
      if (value.invalidTwoFactorCode) {
        codeControl?.setErrors({ invalid: true })
      }
      if (value.invalidTwoFactorRecoveryCode) {
        recoveryControl?.setErrors({ invalid: true })
      }
    }
  }

  ngOnDestroy() {
    // Only stops this component listening. What follows from a code the
    // registry has already accepted does not hang off this subscription, so
    // dropping it here cannot lose the record notice (R5.4).
    this.verification?.unsubscribe()

    // The countdown belongs to the challenge, not to the application.
    this.recoveryPhone?.dispose()

    const codeControl = this.parentForm?.get(this.codeControlName)
    const recoveryControl = this.parentForm?.get(this.recoveryControlName)
    const recoveryPhoneControl = this.parentForm?.get(
      this.recoveryPhoneControlName
    )

    codeControl?.setValue(null)
    recoveryControl?.setValue(null)
    recoveryPhoneControl?.setValue(null)

    codeControl?.removeValidators(Validators.required)
    recoveryControl?.removeValidators(Validators.required)
    recoveryPhoneControl?.removeValidators(Validators.required)

    codeControl?.updateValueAndValidity({ emitEvent: false })
    recoveryControl?.updateValueAndValidity({ emitEvent: false })
    recoveryPhoneControl?.updateValueAndValidity({ emitEvent: false })
  }
}
