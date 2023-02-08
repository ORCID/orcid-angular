import { Inject, Injectable } from '@angular/core'
import initHelpHero, { HelpHero } from 'helphero'
import { WINDOW } from 'src/app/cdk/window'
import { AssertionVisibilityString } from 'src/app/types'
import { AffiliationUIGroup } from 'src/app/types/record-affiliation.endpoint'
import { NamesEndPoint } from 'src/app/types/record-name.endpoint'
import { WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { UserInfo } from 'src/app/types/userInfo.endpoint'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class HelpHeroService {
  hlp: HelpHero

  private getNumberOfValidatedEmails(emails: AssertionVisibilityString[]): {
    numberOfValidatedEmails: number
    numberOfUnvalidatedEmails: number
  } {
    return {
      numberOfValidatedEmails: emails?.filter((email) => {
        return email.verified === true
      }).length,
      numberOfUnvalidatedEmails: emails?.filter((email) => {
        return email.verified === false
      }).length,
    }
  }

  constructor(@Inject(WINDOW) private window: Window) {}
  initializeHelpHero(userInfo: UserInfo, userRecord: UserRecord) {
    if (
      userInfo?.EFFECTIVE_USER_ORCID &&
      userRecord?.emails?.emails &&
      userRecord?.names &&
      userRecord?.affiliations &&
      userRecord?.works &&
      !this.hlp &&
      !(this.window as any).Cypress
    ) {
      this.modifyHelpHeroScriptOnCreate()
      this.hlp = initHelpHero(environment.HELP_HERO_ID)
      const helpHeroIdentifyObject = {
        numberOfValidatedEmails: this.getNumberOfValidatedEmails(
          userRecord?.emails?.emails
        ).numberOfValidatedEmails,
        numberOfUnvalidatedEmails: this.getNumberOfValidatedEmails(
          userRecord?.emails?.emails
        ).numberOfUnvalidatedEmails,
        givenNames: userRecord.names.givenNames?.value,
        familyName: userRecord.names.familyName?.value,
        publishedName: userRecord.names.creditName?.value,
        orcid: userInfo.EFFECTIVE_USER_ORCID,
        isDelegated: userInfo.EFFECTIVE_USER_ORCID !== userInfo.REAL_USER_ORCID,
        hasAffiliations: !!this.affiliationsCount(userRecord.affiliations),
        hasWorks: !!this.worksCount(userRecord.works),
        displayName: this.getDisplayNames(userRecord.names),
      }
      this.hlp.identify(userInfo.EFFECTIVE_USER_ORCID, helpHeroIdentifyObject)
    }
  }
  private modifyHelpHeroScriptOnCreate() {
    const observer = new MutationObserver((mutations, me) => {
      const helpheroDom = document.getElementById('helphero-dom')
      if (helpheroDom) {
        this.handleHelpHeroChanges(helpheroDom)
        me.disconnect()
        return
      }
    })

    observer.observe(document, {
      childList: true,
      subtree: true,
    })
  }
  handleHelpHeroChanges(helpheroFrame: HTMLElement) {
    this.window.document
      .querySelector('app-root')
      .insertAdjacentElement('beforebegin', helpheroFrame)
    helpheroFrame.setAttribute('aria-hidden', 'true')
  }

  affiliationsCount(affiliations: AffiliationUIGroup[]): number {
    return affiliations.reduce((p, c) => (p += c.affiliationGroup.length), 0)
  }

  worksCount(works: WorksEndpoint): number {
    return works.totalGroups
  }
  private getDisplayNames(recordNames: NamesEndPoint) {
    let displayedName = ''
    if (recordNames?.creditName) {
      displayedName = recordNames.creditName.value
    } else if (
      recordNames?.givenNames?.value &&
      recordNames?.familyName?.value
    ) {
      displayedName = `${recordNames.givenNames.value} ${recordNames.familyName.value}`
    } else if (recordNames?.givenNames?.value) {
      displayedName = `${recordNames.givenNames.value}`
    }

    displayedName = displayedName.trim()
    return displayedName
  }
}
