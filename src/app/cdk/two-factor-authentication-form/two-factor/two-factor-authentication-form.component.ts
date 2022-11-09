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
  styleUrls: ['./two-factor-authentication-form.component.scss'],
  preserveWhitespaces: true,
})
export class TwoFactorAuthenticationFormComponent implements AfterViewInit {
  @Input() showBadVerificationCode: boolean
  @Input() showBadRecoveryCode: boolean
  @Output() authenticate = new EventEmitter<{
    verificationCode?: string
    recoveryCode?: string
  }>()

  @ViewChild('inputVerificationCode')
  inputVerificationCode: ElementRef
  @ViewChild('inputRecoveryCode')
  inputRecoveryCode: ElementRef

  recoveryCode = false

  verificationFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ])

  recoveryCodeFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(10),
  ])

  twoFactorForm = new UntypedFormGroup({
    verificationCode: this.verificationFormControl,
    recoveryCode: this.recoveryCodeFormControl,
  })

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
