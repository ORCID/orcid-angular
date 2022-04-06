import { Inject, Injectable } from '@angular/core'

import { WINDOW } from '../../cdk/window'
import { AssertionVisibilityString, UserInfo } from '../../types'
import { UserRecord } from '../../types/record.local'

@Injectable({
  providedIn: 'root',
})
export class AppcueService {
  constructor(@Inject(WINDOW) private window: Window) {}
  appcueInitialized = false

  private getNumberOfValidatedEmails(
    emails: AssertionVisibilityString[]
  ): { numberOfValidatedEmails: number; numberOfUnvalidatedEmails: number } {
    return {
      numberOfValidatedEmails: emails?.filter((email) => {
        return email.verified === true
      }).length,
      numberOfUnvalidatedEmails: emails?.filter((email) => {
        return email.verified === false
      }).length,
    }
  }

  page() {
    if (this.window['Appcues'] && this.appcueInitialized) {
      this.window['Appcues']?.page()
    }
  }

  initializeAppCues(userInfo: UserInfo, userRecord: UserRecord) {
    if (
      userInfo?.EFFECTIVE_USER_ORCID &&
      userRecord?.emails?.emails &&
      !this.appcueInitialized
    ) {
      this.window['Appcues']?.identify(userInfo?.EFFECTIVE_USER_ORCID, {
        numberOfValidatedEmails: this.getNumberOfValidatedEmails(
          userRecord?.emails?.emails
        ).numberOfValidatedEmails,
        numberOfUnvalidatedEmails: this.getNumberOfValidatedEmails(
          userRecord?.emails?.emails
        ).numberOfUnvalidatedEmails,
      })
      this.appcueInitialized = true
    }
  }
}
