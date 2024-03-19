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

@Component({
  selector: 'app-two-factor-authentication-form',
  templateUrl: './two-factor-authentication-form.component.html',
  styleUrls: [
    './two-factor-authentication-form.component.scss',
    './two-factor-authentication-form.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class TwoFactorAuthenticationFormComponent implements AfterViewInit {
  @Input() showBadVerificationCode: boolean
  @Input() showBadRecoveryCode: boolean
  @Input() signInUpdatesV1Togglz: boolean
  @Output() authenticate = new EventEmitter<{
    verificationCode?: string
    recoveryCode?: string
  }>()

  @ViewChild('inputVerificationCode')
  inputVerificationCode: ElementRef
  @ViewChild('inputRecoveryCode')
  inputRecoveryCode: ElementRef

  recoveryCode = false

  twoFactorForm = new UntypedFormGroup({
    verificationCode: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    recoveryCode: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
    ]),
  })

  get verificationFormControl() {
    return this.twoFactorForm.controls.verificationCode
  }

  get recoveryCodeFormControl() {
    return this.twoFactorForm.controls.recoveryCode
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

  get isVerificationCodeInvalid() {
    return this.verificationFormControl.invalid && this.verificationWasTouched
  }

  get isRecoveryCodeInvalid() {
    return this.recoveryCodeFormControl.invalid && this.recoveryCodeWasTouched
  }

  constructor(
    private cdref: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window
  ) {}

  ngAfterViewInit() {
    this.inputVerificationCode.nativeElement.focus()
    this.cdref.detectChanges()
  }

  onSubmit() {
    this.hideErrorMessages()
    this.disableValidators()

    if (this.twoFactorForm.valid) {
      this.authenticate.emit({
        verificationCode: this.twoFactorForm.value.verificationCode,
        recoveryCode: this.twoFactorForm.value.recoveryCode,
      })

      this.enableValidators()
    }
  }

  disableValidators() {
    if (!this.recoveryCode) {
      this.recoveryCodeFormControl.disable()
    } else {
      this.verificationFormControl.disable()
    }
  }

  enableValidators() {
    this.verificationFormControl.enable()
    this.recoveryCodeFormControl.enable()
  }

  showRecoveryCode() {
    this.hideErrorMessages()
    this.recoveryCode = true
    setTimeout(() => {
      this.inputRecoveryCode.nativeElement.focus()
    })
  }

  showAuthenticationCode() {
    this.hideErrorMessages()
    this.recoveryCode = false
    setTimeout(() => {
      this.inputVerificationCode.nativeElement.focus()
    })
  }

  hideErrorMessages() {
    this.showBadRecoveryCode = false
    this.showBadRecoveryCode = false
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
