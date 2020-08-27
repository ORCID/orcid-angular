import { FormGroup } from '@angular/forms'

export function AtLeastOneInputHasValue() {
  return (group: FormGroup) => {
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
