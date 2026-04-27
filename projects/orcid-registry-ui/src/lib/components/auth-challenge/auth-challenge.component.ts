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

  @Output() submitAttempt = new EventEmitter<void>()
  @Output() cancelAttempt = new EventEmitter<void>()

  @Input() parentForm!: FormGroup
  @Input() codeControlName = 'twoFactorCode'
  @Input() recoveryControlName = 'twoFactorRecoveryCode'
  @Input() passwordControlName = 'password'
  @Input() showPasswordField = true
  @Input() showTwoFactorField = true
  @Input() actionDescription = ''
  @Input() boldText = ''
  @Input() trailingText = ''

  invalidPassword = false
  invalidTwoFactorCode = false
  invalidTwoFactorRecoveryCode = false
  showRecoveryCode = false
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()
  loading = false

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
      this.passwordControlName =
        this.data.passwordControlName ?? this.passwordControlName
      this.showPasswordField =
        this.data.showPasswordField ?? this.showPasswordField
      this.showTwoFactorField =
        this.data.showTwoFactorField ?? this.showTwoFactorField
      this.actionDescription =
        this.data.actionDescription ?? this.actionDescription
      this.boldText = this.data.boldText ?? this.boldText
      this.trailingText = this.data.trailingText ?? this.trailingText
    }

    if (this.showPasswordField) {
      this.parentForm?.get(this.passwordControlName)?.setValue(null)
      this.parentForm?.get(this.passwordControlName)?.markAsUntouched()
    }

    this.parentForm?.get(this.codeControlName)?.markAsUntouched()
    this.parentForm?.get(this.recoveryControlName)?.markAsUntouched()
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

  onSubmit() {
    this.loading = true
    this.parentForm?.markAllAsTouched()
    this.submitAttempt.emit()
  }

  onCancel() {
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

  private updateTwoFactorValidators() {
    const twoFactorCodeControl = this.parentForm?.get(this.codeControlName)
    const recoveryCodeControl = this.parentForm?.get(this.recoveryControlName)

    if (!this.showTwoFactorField) {
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
    const codeControl = this.parentForm?.get(this.codeControlName)
    const recoveryControl = this.parentForm?.get(this.recoveryControlName)

    codeControl?.setValue(null)
    recoveryControl?.setValue(null)

    codeControl?.removeValidators(Validators.required)
    recoveryControl?.removeValidators(Validators.required)

    codeControl?.updateValueAndValidity({ emitEvent: false })
    recoveryControl?.updateValueAndValidity({ emitEvent: false })
  }
}
