import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { WINDOW } from '../../window'

/**
 * Which credential the form is asking for. It used to be a single boolean
 * flipping between the app code and a recovery code; the recovery phone number
 * is a third answer to the same question, and a boolean cannot hold three
 * states. `recoveryCode` is kept as an accessor over this field so every
 * existing binding, and every existing caller, still works.
 */
export type TwoFactorFormMode = 'totp' | 'recovery' | 'phone'

/**
 * What the host knows about the code it asked the registry to text. The form
 * owns none of it: sending is the host's call to make, because only the host
 * holds the username and password the registry wants (R3.2).
 */
export interface RecoveryPhoneSignInState {
  codeSent: boolean
  maskedNumber?: string
  resendSeconds: number
  sending: boolean
  errorCode?: string
}

@Component({
  selector: 'app-two-factor-authentication-form',
  templateUrl: './two-factor-authentication-form.component.html',
  styleUrls: [
    './two-factor-authentication-form.component.scss',
    './two-factor-authentication-form.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class TwoFactorAuthenticationFormComponent implements AfterViewInit {
  @Input() showBadVerificationCode: boolean
  @Input() showBadRecoveryCode: boolean

  /**
   * Turns on the "Don't have your device or your recovery codes?" option
   * (R3.1). Off, the form renders exactly what it always has.
   */
  @Input() recoveryPhoneOptionAvailable = false

  private _recoveryPhoneState: RecoveryPhoneSignInState = {
    codeSent: false,
    resendSeconds: 0,
    sending: false,
  }

  /**
   * The code field sits behind an *ngIf on `codeSent`, so it does not exist at
   * the moment the user chooses to be texted. Focus is taken here instead, on
   * the change that actually renders it: the setTimeout lets that *ngIf run
   * first, and the false-to-true guard keeps the countdown's own updates from
   * yanking focus back every second.
   */
  @Input() set recoveryPhoneState(value: RecoveryPhoneSignInState) {
    const wasSent = this._recoveryPhoneState?.codeSent
    this._recoveryPhoneState = value || {
      codeSent: false,
      resendSeconds: 0,
      sending: false,
    }
    if (!wasSent && this._recoveryPhoneState.codeSent) {
      setTimeout(() => {
        this.inputRecoveryPhoneCode?.nativeElement.focus()
      })
    }
  }

  get recoveryPhoneState(): RecoveryPhoneSignInState {
    return this._recoveryPhoneState
  }

  @Output() requestRecoveryPhoneCode = new EventEmitter<void>()

  @Output() authenticate = new EventEmitter<{
    verificationCode?: string
    recoveryCode?: string
    recoveryPhoneCode?: string
  }>()

  @ViewChild('inputVerificationCode')
  inputVerificationCode: ElementRef
  @ViewChild('inputRecoveryCode')
  inputRecoveryCode: ElementRef
  @ViewChild('inputRecoveryPhoneCode')
  inputRecoveryPhoneCode: ElementRef

  mode: TwoFactorFormMode = 'totp'

  twoFactorForm = new UntypedFormGroup({
    verificationCode: new UntypedFormControl(''),
    recoveryCode: new UntypedFormControl(''),
    recoveryPhoneCode: new UntypedFormControl({ value: '', disabled: true }),
  })

  /**
   * The original two-state flag, preserved so existing templates, specs and
   * callers keep working now that the mode is a three-state field.
   */
  get recoveryCode(): boolean {
    return this.mode === 'recovery'
  }

  set recoveryCode(value: boolean) {
    this.mode = value ? 'recovery' : 'totp'
    this.applyModeControlState()
  }

  get authenticationCodeMode(): boolean {
    return this.mode === 'totp'
  }

  get recoveryPhoneMode(): boolean {
    return this.mode === 'phone'
  }

  get verificationFormControl() {
    return this.twoFactorForm.controls.verificationCode
  }

  get recoveryCodeFormControl() {
    return this.twoFactorForm.controls.recoveryCode
  }

  get recoveryPhoneCodeFormControl() {
    return this.twoFactorForm.controls.recoveryPhoneCode
  }

  get verificationWasTouched() {
    return (
      this.verificationFormControl.dirty && this.verificationFormControl.touched
    )
  }

  get recoveryCodeWasTouched() {
    return (
      this.recoveryCodeFormControl.dirty && this.recoveryCodeFormControl.touched
    )
  }

  get recoveryPhoneCodeWasTouched() {
    return (
      this.recoveryPhoneCodeFormControl.dirty &&
      this.recoveryPhoneCodeFormControl.touched
    )
  }

  get isVerificationCodeInvalid() {
    return this.verificationFormControl.invalid && this.verificationWasTouched
  }

  get isRecoveryCodeInvalid() {
    return this.recoveryCodeFormControl.invalid && this.recoveryCodeWasTouched
  }

  get isRecoveryPhoneCodeInvalid() {
    return (
      this.recoveryPhoneCodeFormControl.invalid &&
      this.recoveryPhoneCodeWasTouched
    )
  }

  /** True once the registry has texted a code and the field can be filled in. */
  get recoveryPhoneCodeSent(): boolean {
    return !!this.recoveryPhoneState?.codeSent
  }

  get recoveryPhoneResendSeconds(): number {
    return this.recoveryPhoneState?.resendSeconds || 0
  }

  get recoveryPhoneSending(): boolean {
    return !!this.recoveryPhoneState?.sending
  }

  /**
   * One message per error code the endpoints answer with, so the form maps
   * codes and never renders text the backend wrote (R3.4).
   */
  get recoveryPhoneErrorMessage(): string | null {
    const errorCode = this.recoveryPhoneState?.errorCode
    if (!errorCode) {
      return null
    }
    switch (errorCode) {
      case 'INVALID_CODE':
        return $localize`:@@ngOrcid.signin.2fa.badRecoveryNumberCode:Invalid recovery number code`
      case 'NO_RECOVERY_PHONE':
        return $localize`:@@ngOrcid.signin.2fa.noRecoveryNumber:This account has no recovery phone number`
      case 'BAD_CREDENTIALS':
        return $localize`:@@ngOrcid.signin.invalidSignInDetails:Invalid sign in details`
      case 'CODE_EXPIRED':
      case 'TOO_MANY_ATTEMPTS':
        return $localize`:@@account.verificationCodeExpired:That code is no longer valid. Send a new code.`
      case 'SMS_SEND_FAILED':
      case 'SMS_RECIPIENT_NOT_ALLOWED':
      case 'SMS_PROVIDER_NOT_CONFIGURED':
      case 'CODE_STORAGE_UNAVAILABLE':
        return $localize`:@@account.recoveryPhoneSendFailed:We could not send a verification code. Please try again.`
      default:
        return $localize`:@@account.recoveryPhoneGenericError:Something went wrong. Please try again.`
    }
  }

  constructor(
    private cdref: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window
  ) {}

  ngAfterViewInit() {
    this.inputVerificationCode?.nativeElement.focus()
    this.cdref.detectChanges()
  }

  onSubmit() {
    this.hideErrorMessages()
    // Nothing to post until the registry has actually texted a code: the
    // field is not on screen yet, so "required" would be a lie
    if (this.recoveryPhoneMode && !this.recoveryPhoneCodeSent) {
      return
    }
    this.addValidators()

    if (this.twoFactorForm.valid) {
      if (this.recoveryPhoneMode) {
        this.authenticate.emit({
          recoveryPhoneCode: this.recoveryPhoneCodeFormControl.value,
        })
      } else {
        this.authenticate.emit({
          verificationCode: this.twoFactorForm.value.verificationCode,
          recoveryCode: this.twoFactorForm.value.recoveryCode,
        })
      }
      this.enableValidators()
    } else {
      this.enableValidators()
    }
  }

  addValidators() {
    if (this.mode === 'totp') {
      this.verificationFormControl.setValidators([
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
      ])
      this.verificationFormControl.updateValueAndValidity()
      this.verificationFormControl.markAsDirty()
      this.verificationFormControl.markAsTouched()
      this.recoveryCodeFormControl.disable()
      this.recoveryPhoneCodeFormControl.disable()
    } else if (this.mode === 'recovery') {
      this.recoveryCodeFormControl.setValidators([
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ])
      this.recoveryCodeFormControl.updateValueAndValidity()
      this.recoveryCodeFormControl.markAsDirty()
      this.recoveryCodeFormControl.markAsTouched()
      this.verificationFormControl.disable()
      this.recoveryPhoneCodeFormControl.disable()
    } else {
      // A disabled control counts as valid, so make sure this one is in the
      // form before its validity is what decides whether anything is posted
      this.recoveryPhoneCodeFormControl.enable()
      this.recoveryPhoneCodeFormControl.setValidators([
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
      ])
      this.recoveryPhoneCodeFormControl.updateValueAndValidity()
      this.recoveryPhoneCodeFormControl.markAsDirty()
      this.recoveryPhoneCodeFormControl.markAsTouched()
      this.verificationFormControl.disable()
      this.recoveryCodeFormControl.disable()
    }
  }

  enableValidators() {
    this.verificationFormControl.enable()
    this.recoveryCodeFormControl.enable()
    this.applyModeControlState()
  }

  showRecoveryCode() {
    this.hideErrorMessages()
    this.mode = 'recovery'
    this.applyModeControlState()
    setTimeout(() => {
      this.inputRecoveryCode?.nativeElement.focus()
    })
  }

  showAuthenticationCode() {
    this.hideErrorMessages()
    this.mode = 'totp'
    this.applyModeControlState()
    setTimeout(() => {
      this.inputVerificationCode?.nativeElement.focus()
    })
  }

  /**
   * Switches to the recovery number and asks the host for a code in one
   * gesture: the user chose "send me a text", not "show me a field".
   */
  showRecoveryPhoneCode() {
    this.hideErrorMessages()
    this.mode = 'phone'
    this.applyModeControlState()
    // No focus target yet: the field appears only once the host reports the
    // code was sent, so the recoveryPhoneState setter takes focus from here
    this.requestRecoveryPhoneCode.emit()
  }

  /** Asks for another text once the registry's resend buffer has run out. */
  resendRecoveryPhoneCode() {
    this.requestRecoveryPhoneCode.emit()
  }

  hideErrorMessages() {
    this.showBadVerificationCode = false
    this.showBadRecoveryCode = false
  }

  navigateTo(val) {
    ;(this.window as any).outOfRouterNavigation(val)
  }

  /**
   * Keeps the recovery number field out of the form's validity whenever the
   * user is not answering with a texted code.
   */
  private applyModeControlState() {
    if (this.recoveryPhoneMode) {
      this.recoveryPhoneCodeFormControl.enable()
    } else {
      this.recoveryPhoneCodeFormControl.disable()
    }
  }
}
