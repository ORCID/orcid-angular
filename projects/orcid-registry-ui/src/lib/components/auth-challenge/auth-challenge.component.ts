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

class ErrorStateMatcherForTwoFactorFields implements ErrorStateMatcher {
  constructor() {}
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
  @ViewChild('passwordInput') passwordInput: ElementRef
  @ViewChild('twoFactorCodeInput') twoFactorCodeInput: ElementRef
  @ViewChild('twoFactorRecoveryCodeInput')
  twoFactorRecoveryCodeInput: ElementRef

  @Output() submitAttempt = new EventEmitter<void>()

  invalidPassword = false
  invalidTwoFactorCode = false
  invalidTwoFactorRecoveryCode = false
  showRecoveryCode = false
  parentForm: FormGroup
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()
  loading = false

  constructor(
    private matRef: MatDialogRef<AuthChallengeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.matRef.updateSize('580px')
    const defaultData = {
      codeControlName: 'twoFactorCode',
      recoveryControlName: 'twoFactorRecoveryCode',
      passwordControlName: 'password',
      showPasswordField: true,
      showTwoFactorField: true,
      parentForm: null,
    }

    this.data = { ...defaultData, ...(data || {}) }
  }

  ngOnInit() {
    this.parentForm = this.data.parentForm
    if (this.data.showPasswordField) {
      this.parentForm.get(this.data.passwordControlName)?.setValue(null)
      this.parentForm.get(this.data.passwordControlName)?.markAsUntouched()
    }
    this.parentForm?.get(this.data.codeControlName)?.markAsUntouched()
    this.parentForm?.get(this.data.recoveryControlName)?.markAsUntouched()
    this.updateTwoFactorValidators()
  }

  get passwordWasTouched() {
    return this.parentForm?.get(this.data.passwordControlName)?.touched
  }

  get twoFactorCodeWasTouched() {
    return this.parentForm?.get(this.data.codeControlName)?.touched
  }

  get twoFactorRecoveryCodeWasTouched() {
    return this.parentForm?.get(this.data.recoveryControlName)?.touched
  }

  onSubmit() {
    this.loading = true
    this.parentForm.markAllAsTouched()
    this.submitAttempt.emit()
  }

  toggleRecoveryCode(event: Event) {
    event.preventDefault()
    this.showRecoveryCode = !this.showRecoveryCode

    if (this.showRecoveryCode) {
      setTimeout(() => {
        this.twoFactorRecoveryCodeInput?.nativeElement.focus()
      })
      this.parentForm?.get(this.data.codeControlName)?.setValue(null)
      this.parentForm?.get(this.data.recoveryControlName)?.markAsUntouched()
    } else {
      setTimeout(() => {
        this.twoFactorCodeInput?.nativeElement.focus()
      })
      this.parentForm?.get(this.data.recoveryControlName)?.setValue(null)
      this.parentForm?.get(this.data.codeControlName)?.markAsUntouched()
    }
    this.updateTwoFactorValidators()
  }

  private updateTwoFactorValidators() {
    const twoFactorCodeControl = this.parentForm?.get(this.data.codeControlName)
    const recoveryCodeControl = this.parentForm?.get(
      this.data.recoveryControlName
    )

    if (!this.data.showTwoFactorField) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
    } else if (this.showRecoveryCode) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.addValidators(Validators.required)
    } else {
      twoFactorCodeControl?.addValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
    }

    twoFactorCodeControl?.updateValueAndValidity()
    recoveryCodeControl?.updateValueAndValidity()
  }

  processBackendResponse(value: any) {
    this.loading = false

    const codeControl = this.parentForm?.get(this.data.codeControlName)
    const recoveryControl = this.parentForm?.get(this.data.recoveryControlName)
    const passwordControl = this.parentForm?.get(this.data.passwordControlName)

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
    const codeControl = this.parentForm?.get(this.data.codeControlName)
    const recoveryControl = this.parentForm?.get(this.data.recoveryControlName)

    codeControl?.setValue(null)
    recoveryControl?.setValue(null)

    codeControl?.removeValidators(Validators.required)
    recoveryControl?.removeValidators(Validators.required)

    codeControl?.updateValueAndValidity({ emitEvent: false })
    recoveryControl?.updateValueAndValidity({ emitEvent: false })
  }
}
