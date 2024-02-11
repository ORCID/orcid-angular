import { Assertion } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'

export class NamesUtil {
  static getGivenNames(userRecord: UserRecord): string {
    return userRecord?.names?.givenNames
      ? userRecord.names.givenNames.value
      : ''
  }

  static getFamilyName(userRecord: UserRecord): string {
    return userRecord?.names?.familyName
      ? userRecord.names.familyName.value
      : ''
  }

  static getCreditName(userRecord: UserRecord): string {
    return userRecord?.names?.creditName
      ? userRecord.names.creditName.value
      : ''
  }

  static isNamePublicAndAffiliations(
    userRecord: UserRecord,
    affiliations: number
  ): boolean {
    if (
      (affiliations === 0 && !!this.getGivenNames(userRecord)) ||
      !!this.getFamilyName(userRecord) ||
      !!this.getCreditName(userRecord)
    ) {
      return true
    }
    return false
  }

  static getAriaLabelName(
    userRecord: UserRecord,
    ariaLabelName: string
  ): string {
    if (userRecord?.names) {
      if (userRecord?.names?.creditName?.value) {
        return userRecord?.names?.creditName?.value
      } else {
        if (userRecord?.names?.givenNames?.value) {
          return userRecord?.names?.givenNames?.value
        }
        if (userRecord?.names?.familyName?.value) {
          if (ariaLabelName) {
            return ariaLabelName + ' ' + userRecord?.names?.familyName?.value
          } else {
            return userRecord?.names?.familyName?.value
          }
        }
      }
    }
    return
  }

  static getOtherNamesUnique(otherNames: Assertion[]): string {
    return otherNames
      .map((otherName) => {
        return otherName.content
      })
      .filter(function (item, pos, array) {
        return (
          array
            .map((x) => x.toLowerCase().trim())
            .indexOf(item.toLowerCase().trim()) === pos
        )
      })
      .join(', ')
  }
}
