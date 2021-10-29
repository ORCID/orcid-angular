import { AbstractControl, ValidatorFn } from '@angular/forms'

export class FundedByRelationValidator {
  static fundedByInvalidRelationship(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.get('externalRelationship')?.value === 'funded-by') {
        console.log(c.get('externalIdentifierType'))

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
}
