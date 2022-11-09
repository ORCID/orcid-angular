import { AbstractControl, UntypedFormArray, ValidatorFn } from '@angular/forms'

export class WorkIdentifiers {
  static fundedByInvalidRelationship(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.get('externalRelationship')?.value === 'funded-by') {
        if (
          ['grant_number', 'doi', 'uri', 'proposal-id'].indexOf(
            c.get('externalIdentifierType')?.value
          ) >= 0
        ) {
          return null
        }

        return { funded_by_invalid: true }
      }

      return null
    }
  }
  static versionOfInvalidRelationship(
    identifiersArray: UntypedFormArray
  ): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.get('externalRelationship')?.value === 'version-of') {
        let hasASelfRelationShip = false
        // The array needs a `self` relation when there is a `version-of` relationship.
        identifiersArray.controls.forEach((control: AbstractControl) => {
          if (control.get('externalRelationship')?.value === 'self') {
            hasASelfRelationShip = true
          }
        })
        if (!hasASelfRelationShip) {
          return { version_of_invalid: true }
        }
      }

      return null
    }
  }
}
