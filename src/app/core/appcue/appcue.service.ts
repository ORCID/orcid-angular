import { Inject, Injectable } from '@angular/core'
import { AssertionVisibilityString, UserInfo } from '../../types'
import { UserRecord } from '../../types/record.local'
import { WINDOW } from '../../cdk/window'

@Injectable({
  providedIn: 'root',
})
export class AppcueService {

  constructor(@Inject(WINDOW) private window: Window) {}
  appcueInitialized = false

  private static getNumberOfValidatedEmails(
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

  initializeAppCues(userInfo: UserInfo, userRecord: UserRecord) {
    if (userInfo?.EFFECTIVE_USER_ORCID && userRecord?.emails?.emails && !this.appcueInitialized) {
      this.window['Appcues']?.identify(userInfo?.EFFECTIVE_USER_ORCID, {
        numberOfValidatedEmails: AppcueService.getNumberOfValidatedEmails(
          userRecord?.emails?.emails
        ).numberOfValidatedEmails,
        numberOfUnvalidatedEmails: AppcueService.getNumberOfValidatedEmails(
          userRecord?.emails?.emails
        ).numberOfUnvalidatedEmails,
      })
      this.appcueInitialized = true
    }
  }
}
