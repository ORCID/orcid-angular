import { ValidatorFn, AbstractControl, Validators } from '@angular/forms'

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
}
