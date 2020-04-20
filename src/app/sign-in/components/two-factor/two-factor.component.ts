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
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WINDOW } from '../../../cdk/window'

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss'],
})
export class TwoFactorComponent implements AfterViewInit {
  @Input() showBadVerificationCode: boolean
  @Input() showBadRecoveryCode: boolean
  @Output() authenticate = new EventEmitter<object>()

  @ViewChild('inputVerificationCode')
  inputVerificationCode: ElementRef
  @ViewChild('inputRecoveryCode')
  inputRecoveryCode: ElementRef

  recoveryCode = false

  verificationFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ])

  recoveryCodeFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(10),
  ])

  twoFactorForm = new FormGroup({
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
    this.recoveryCode = true
    setTimeout(() => {
      this.inputRecoveryCode.nativeElement.focus()
    })
  }

  showAuthenticationCode() {
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
