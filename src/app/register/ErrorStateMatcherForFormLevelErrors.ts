import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core/error/error-options'

export class ErrorStateMatcherForFormLevelErrors implements ErrorStateMatcher {
  getControlErrorAtForm: (control: FormControl, errorGroup: string) => string[]
  errorGroup: string
  constructor(
    getControlErrorAtForm: (
      control: FormControl,
      errorGroup: string
    ) => string[],
    errorGroup: string
  ) {
    this.getControlErrorAtForm = getControlErrorAtForm
    this.errorGroup = errorGroup
  }
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const errorsAtFormLevel = this.getControlErrorAtForm(
      control,
      this.errorGroup
    )
    const controlInteracted = control.touched || (form && form.submitted)
    const validControlAtFormLevel = !(
      errorsAtFormLevel && errorsAtFormLevel.length > 0
    )
    const validControl = control && !control.invalid
    return !(validControlAtFormLevel && validControl) && controlInteracted
  }
}
