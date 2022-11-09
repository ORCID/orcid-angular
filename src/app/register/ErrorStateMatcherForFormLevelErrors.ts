import { UntypedFormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class ErrorStateMatcherForFormLevelErrors implements ErrorStateMatcher {
  getControlErrorAtForm: (
    control: UntypedFormControl,
    errorGroup: string
  ) => string[]
  errorGroup: string
  constructor(
    getControlErrorAtForm: (
      control: UntypedFormControl,
      errorGroup: string
    ) => string[],
    errorGroup: string
  ) {
    this.getControlErrorAtForm = getControlErrorAtForm
    this.errorGroup = errorGroup
  }
  isErrorState(
    control: UntypedFormControl | null,
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
