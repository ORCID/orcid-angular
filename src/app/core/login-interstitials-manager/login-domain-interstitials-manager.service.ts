import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { LoginBaseInterstitialManagerService } from './login-abstract-interstitial-manager.service'
import {
  ShareEmailsDomainsComponentDialogInput,
  ShareEmailsDomainsDialogComponent,
  ShareEmailsDomainsComponentDialogOutput,
} from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { TogglzService } from '../togglz/togglz.service'
import { EmailsEndpoint } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { InterstitialManagerServiceInterface } from './login-interface-interstitial-manager.service'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { QaFlag } from '../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../qa-flag/qa-flag.service'

@Injectable({
  providedIn: 'root',
})
export class LoginDomainInterstitialManagerService
  extends LoginBaseInterstitialManagerService<
    ShareEmailsDomainsComponentDialogInput,
    ShareEmailsDomainsComponentDialogOutput
  >
  implements
    InterstitialManagerServiceInterface<
      ShareEmailsDomainsComponentDialogInput,
      ShareEmailsDomainsComponentDialogOutput
    >
{
  QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN =
    QaFlag.forceDomainInterstitialAsNeverSeem
  INTERSTITIAL_NAME: InterstitialType = 'DOMAIN_INTERSTITIAL'
  INTERSTITIAL_TOGGLE = 'LOGIN_DOMAINS_INTERSTITIAL'

  constructor(
    _matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService
  ) {
    // Pass dependencies to the parent
    super(_matDialog, togglzService, interstitialsService, qaFlagService)
  }
  /**
   * Decide if the affiliation interstitial should be shown.
   * Returns an Observable<boolean> that emits `true` if it *should* show, or `false` if not.
   */
  userIsElegibleForInterstitial(userRecord: UserRecord): Observable<boolean> {
    // Basic checks
    if (!userRecord?.emails?.emailDomains?.length) return of(false)

    const hasNoPublicDomains = !this.userHasPublicDomains(userRecord.emails)
    const hasPrivateDomains = this.userHasPrivateDomains(userRecord.emails)

    if (!hasNoPublicDomains || !hasPrivateDomains) {
      return of(false)
    }
    return of(true)
  }

  // Return the dialog component that we want to display
  getDialogComponentToShow(): ComponentType<any> {
    return ShareEmailsDomainsDialogComponent
  }

  // Build the data that goes into our dialog
  getDialogDataToShow(
    userRecord: UserRecord
  ): ShareEmailsDomainsComponentDialogInput {
    return { userEmailsJson: userRecord.emails }
  }

  private userHasPublicDomains(value: EmailsEndpoint): boolean {
    return value.emailDomains.some((domain) => domain.visibility === 'PUBLIC')
  }

  private userHasPrivateDomains(value: EmailsEndpoint): boolean {
    return value.emailDomains.some((domain) => domain.visibility !== 'PUBLIC')
  }
}
