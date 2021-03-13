import { AbstractControl, ValidatorFn } from '@angular/forms'

export class InstitutionValidator {
  static valueSelected(institutionsNames: string[]): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const institutionName = c.value as string
      if (institutionName === '') {
        return null
      }

      const pickedOrNot = institutionsNames.filter(
        (institution) =>
          institution.toLowerCase() === institutionName.toString().toLowerCase()
      )

      if (pickedOrNot.length === 0) {
        return { invalidInstitution: true }
      }
      return null
    }
  }
}
