import { E } from '@angular/cdk/keycodes'
import { Assertion } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'

export class RecordUtil {
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
      .join('; ')
  }

  static isSideBarEmpty(
    isPublicRecord: boolean,
    userRecord: UserRecord
  ): boolean {
    if (
      (userRecord?.emails?.emails &&
        (!isPublicRecord || userRecord.emails.emails.length > 0)) ||
      (userRecord?.emails?.emailDomains &&
        (!isPublicRecord || userRecord.emails.emailDomains.length > 0)) ||
      (userRecord?.website?.websites &&
        (!isPublicRecord || userRecord.website.websites.length > 0)) ||
      (userRecord?.externalIdentifier?.externalIdentifiers &&
        userRecord?.externalIdentifier?.externalIdentifiers.length > 0) ||
      (userRecord?.keyword?.keywords &&
        (!isPublicRecord || userRecord.keyword.keywords.length > 0)) ||
      (userRecord?.countries?.addresses &&
        (!isPublicRecord || userRecord.countries.addresses.length > 0))
    ) {
      return true
    }
    return false
  }

  static scrollTo(activitySection: string, event?: KeyboardEvent) {
    const targetElement = document.getElementById(activitySection)

    if (targetElement) {
      if (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })

          targetElement.setAttribute('tabindex', '-1')
          targetElement.focus()
          targetElement.removeAttribute('tabindex')
        }
      } else {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  static appendOpensInNewTab(ariaLabel: string): string {
    return `${ariaLabel} ${$localize`:@@shared.opensInNewTab:(opens in a new tab)`}`
  }
}
