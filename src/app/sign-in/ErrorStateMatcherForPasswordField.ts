import { AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core/error/error-options'

export class ErrorStateMatcherForPasswordField implements ErrorStateMatcher {
  constructor() {} 
  isErrorState(
    control: FormControl | AbstractControl | null,
  ): boolean {
    return control.invalid
  }
}
