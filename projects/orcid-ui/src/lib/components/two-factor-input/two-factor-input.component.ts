import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, SkipSelf } from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ErrorStateMatcher } from '@angular/material/core'

class ErrorStateMatcherForTwoFactorFields implements ErrorStateMatcher {
  constructor() {}
  isErrorState(control: UntypedFormControl | AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched && control.dirty)
  }
}

@Component({
  selector: 'app-two-factor-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
  templateUrl: './two-factor-input.component.html',
  styleUrl: './two-factor-input.component.scss',
})
export class TwoFactorInputComponent implements OnInit {
  @Input() codeControlName = 'twoFactorCode'
  @Input() recoveryControlName = 'twoFactorRecoveryCode'
  @Input() showRecoveryCode = false
  parentForm: FormGroup
  errorMatcher = new ErrorStateMatcherForTwoFactorFields()

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.parentForm = this.controlContainer.control as FormGroup
  }

  get twoFactorCodeWasTouched() {
    return (
      this.parentForm.get(this.codeControlName).dirty &&
      this.parentForm.get(this.codeControlName).touched
    )
  }

  get twoFactorRecoveryCodeWasTouched() {
    return (
      this.parentForm.get(this.recoveryControlName).dirty &&
      this.parentForm.get(this.recoveryControlName).touched
    )
  }
}
