import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewChild,
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AlertMessageComponent } from '../alert-message/alert-message.component'

class ErrorStateMatcherForTwoFactorFields implements ErrorStateMatcher {
  constructor() {}
  isErrorState(control: UntypedFormControl | AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched)
  }
}

@Component({
  selector: 'app-two-factor-auth-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    AlertMessageComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
  templateUrl: './two-factor-auth-form.component.html',
  styleUrls: [
    './two-factor-auth-form.component.scss',
    './two-factor-auth-form.component.scss-theme.scss',
  ],
})
export class TwoFactorAuthFormComponent implements OnInit, OnDestroy {
  @Input() codeControlName = 'twoFactorCodeControl'
  @Input() recoveryControlName = 'twoFactorRecoveryCodeControl'
  @Input() passwordControlName = 'passwordControl'
  @Input() showAlert = false
  @Input() showHelpText = true
  @Input() showPasswordField = true
  @Input() showTwoFactorField = false
  @ViewChild('passwordInput') passwordInput: ElementRef
  @ViewChild('twoFactorCodeInput') twoFactorCodeInput: ElementRef
  @ViewChild('twoFactorRecoveryCodeInput')
  twoFactorRecoveryCodeInput: ElementRef
  invalidPassword = false
  invalidTwoFactorCode = false
  invalidTwoFactorRecoveryCode = false
  showRecoveryCode = false
  parentForm: FormGroup
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.parentForm = this.controlContainer.control as FormGroup
    this.updateTwoFactorValidators()
  }

  get passwordWasTouched() {
    return this.parentForm.get(this.passwordControlName).touched
  }

  get twoFactorCodeWasTouched() {
    return this.parentForm.get(this.codeControlName).touched
  }

  get twoFactorRecoveryCodeWasTouched() {
    return this.parentForm.get(this.recoveryControlName).touched
  }

  toggleRecoveryCode(event: Event) {
    event.preventDefault()
    this.showRecoveryCode = !this.showRecoveryCode
    if (this.showRecoveryCode) {
      setTimeout(() => {
        this.twoFactorRecoveryCodeInput?.nativeElement.focus()
      })
      this.parentForm.get(this.codeControlName)?.setValue(null)
      this.parentForm.get(this.recoveryControlName)?.markAsUntouched()
    } else {
      setTimeout(() => {
        this.twoFactorCodeInput?.nativeElement.focus()
      })
      this.parentForm.get(this.recoveryControlName)?.setValue(null)
      this.parentForm.get(this.codeControlName)?.markAsUntouched()
    }
    this.updateTwoFactorValidators()
  }

  private updateTwoFactorValidators() {
    const twoFactorCodeControl = this.parentForm.get(this.codeControlName)
    const recoveryCodeControl = this.parentForm.get(this.recoveryControlName)

    if (this.showRecoveryCode) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.addValidators(Validators.required)
    } else {
      twoFactorCodeControl?.addValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
    }

    twoFactorCodeControl?.updateValueAndValidity({ emitEvent: false })
    recoveryCodeControl?.updateValueAndValidity({ emitEvent: false })
  }

  processBackendResponse(value: any) {
    const codeControl = this.parentForm.get(this.codeControlName)
    const recoveryControl = this.parentForm.get(this.recoveryControlName)
    const passwordControl = this.parentForm.get(this.passwordControlName)

    /*     if (value.invalidPassword) {
      codeControl?.setValue(null)
      recoveryControl?.setValue(null)
      codeControl?.markAsUntouched()
      recoveryControl?.markAsUntouched()
    } */

    if (value.invalidPassword) {
      passwordControl?.setErrors({ invalid: true })
    }

    if (value.invalidTwoFactorCode) {
      codeControl?.setErrors({ invalid: true })
    }

    if (value.invalidTwoFactorRecoveryCode) {
      recoveryControl?.setErrors({ invalid: true })
    }

    if (
      value.twoFactorEnabled &&
      !value.invalidPassword &&
      !value.invalidTwoFactorCode &&
      !value.invalidTwoFactorRecoveryCode
    ) {
      setTimeout(() => {
        if (this.showRecoveryCode) {
          this.twoFactorRecoveryCodeInput?.nativeElement.focus()
        } else {
          this.twoFactorCodeInput?.nativeElement.focus()
        }
      })
    }
  }

  ngOnDestroy() {
    const codeControl = this.parentForm.get(this.codeControlName)
    const recoveryControl = this.parentForm.get(this.recoveryControlName)

    codeControl?.removeValidators(Validators.required)
    recoveryControl?.removeValidators(Validators.required)

    codeControl?.updateValueAndValidity({ emitEvent: false })
    recoveryControl?.updateValueAndValidity({ emitEvent: false })
  }
}
