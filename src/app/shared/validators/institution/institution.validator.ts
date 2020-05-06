import { AbstractControl, ValidatorFn } from '@angular/forms'

export class InstitutionValidator {
  static valueSelected(myArray: any): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const institutionName = c.value
      if (institutionName === '') {
        return null
      }

      const pickedOrNot = myArray.filter((institution) =>
        institution.DisplayNames.some(
          (displayNames) =>
            displayNames.value.toString().toLowerCase() ===
            institutionName.toString().toLowerCase()
        )
      )

      if (pickedOrNot.length === 0) {
        return { invalidInstitution: true }
      }
      return null
    }
  }
}
