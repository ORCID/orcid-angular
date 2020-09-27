import {
  ValidatorFn,
  AbstractControl,
  Validators,
  FormGroup,
} from '@angular/forms'
import { EMAIL_REGEXP, EMAIL_REGEXP_GENERIC } from './constants'

export class OrcidValidators {
  static email = (control: AbstractControl) => {
    const patterErrors = Validators.pattern(EMAIL_REGEXP)
    const result = patterErrors(control)
    if (control.value && result?.pattern) {
      return { email: true }
    } else {
      return null
    }
  }

  static emailGeneric = (control: AbstractControl) => {
    const patterErrors = Validators.pattern(EMAIL_REGEXP_GENERIC)
    const result = patterErrors(control)
    if (control.value && result?.pattern) {
      return { email: true }
    } else {
      return null
    }
  }

  static notPattern(pattern: string | RegExp): ValidatorFn {
    return (control: AbstractControl) => {
      const patterErrors = Validators.pattern(pattern)
      const result = patterErrors(control)

      if ((result && result.pattern) || control.value === '') {
        return null
      } else {
        return { notPattern: 'the pattern is valid' }
      }
    }
  }

  static matchValues(
    value1: string,
    value2: string,
    caseSensitive = true
  ): ValidatorFn {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[value1]
      const confirmControl = formGroup.controls[value2]

      if (!control || !confirmControl) {
        return null
      }

      if (confirmControl.errors && !confirmControl.errors.mismatch) {
        return null
      }

      const firstValue = caseSensitive
        ? control.value
        : control.value.toLowerCase()
      const secondValue = caseSensitive
        ? confirmControl.value
        : confirmControl.value.toLowerCase()

      if (firstValue !== secondValue) {
        confirmControl.setErrors({ mismatch: true })
      } else if (confirmControl.hasError('mismatch')) {
        delete confirmControl.errors['mismatch']
        confirmControl.updateValueAndValidity()
      }
    }
  }
}
