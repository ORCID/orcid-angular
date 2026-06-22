import { AbstractControl, UntypedFormGroup } from '@angular/forms'

export function AtLeastOneInputHasValue() {
  return (control: AbstractControl) => {
    const group = control as UntypedFormGroup
    if (
      !Object.keys(group.value).some(
        (x) =>
          x !== 'otherFields' && group.value[x] !== '' && x !== 'otherFields'
      )
    ) {
      return { message: 'Please input at least one value' }
    }
    return null
  }
}
