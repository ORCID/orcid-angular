import { AbstractControl, UntypedFormControl } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class ErrorStateMatcherForPasswordField implements ErrorStateMatcher {
  constructor() {}
  isErrorState(control: UntypedFormControl | AbstractControl | null): boolean {
    return control.invalid
  }
}
