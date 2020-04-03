import {
  ValidatorFn,
  AbstractControl,
  Validators,
  FormGroup,
} from '@angular/forms'

export class OrcidValidators {
  static notPattern(pattern: string | RegExp): ValidatorFn {
    return (control: AbstractControl) => {
      const patterErrors = Validators.pattern(pattern)
      const result = patterErrors(control)
      if (result && result.pattern) {
        return null
      } else {
        return { notPattern: 'the pattern is valid' }
      }
    }
  }

  static matchValues(value1: string, value2: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[value1]
      const confirmControl = formGroup.controls[value2]

      if (!control || !confirmControl) {
        return null
      }

      if (confirmControl.errors && !confirmControl.errors.passwordMismatch) {
        return null
      }

      if (control.value !== confirmControl.value) {
        confirmControl.setErrors({ passwordMismatch: true })
      } else {
        confirmControl.setErrors(null)
      }
    }
  }
}
