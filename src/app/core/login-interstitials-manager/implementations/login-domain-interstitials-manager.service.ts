import { Inject, Injectable, Type } from '@angular/core'
import { Observable, of } from 'rxjs'

import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { EmailsEndpoint } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { MatDialog } from '@angular/material/dialog'
import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { TogglzService } from '../../togglz/togglz.service'
import { LoginBaseInterstitialManagerService } from '../abstractions/login-abstract-interstitial-manager.service'
import { ShareEmailsDomainsComponent } from 'src/app/cdk/interstitials/share-emails-domains/interstitial-component/share-emails-domains.component'
import {
  ShareEmailsDomainsComponentDialogInput,
  ShareEmailsDomainsComponentDialogOutput,
  ShareEmailsDomainsDialogComponent,
} from 'src/app/cdk/interstitials/share-emails-domains/interstitial-dialog-extend/share-emails-domains-dialog.component'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class LoginDomainInterstitialManagerService extends LoginBaseInterstitialManagerService<
  ShareEmailsDomainsComponentDialogInput,
  ShareEmailsDomainsComponentDialogOutput,
  ShareEmailsDomainsComponent
> {
  QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN =
    QaFlag.forceDomainInterstitialAsNeverSeem
  INTERSTITIAL_NAME: InterstitialType = 'DOMAIN_INTERSTITIAL'
  INTERSTITIAL_TOGGLE = [
    'LOGIN_DOMAINS_INTERSTITIAL',
    'OAUTH_DOMAINS_INTERSTITIAL',
  ]

  constructor(
    _matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService,
    @Inject(WINDOW) private _window: Window
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

    const isImpersonation = !(
      userRecord?.userInfo?.REAL_USER_ORCID ===
      userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    )

    const insidePopUpWindows = !!this._window.opener

    const hasNoPublicDomains = !this.userHasPublicDomains(userRecord.emails)
    const hasPrivateDomains = this.userHasPrivateDomains(userRecord.emails)

    if (
      !hasNoPublicDomains ||
      !hasPrivateDomains ||
      isImpersonation ||
      insidePopUpWindows
    ) {
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
    return {
      userEmailsJson: userRecord.emails,
      type: 'domains-interstitial',
    }
  }

  private userHasPublicDomains(value: EmailsEndpoint): boolean {
    return value.emailDomains.some((domain) => domain.visibility === 'PUBLIC')
  }

  private userHasPrivateDomains(value: EmailsEndpoint): boolean {
    return value.emailDomains.some((domain) => domain.visibility !== 'PUBLIC')
  }

  getComponentToShow(): ComponentType<ShareEmailsDomainsComponent> {
    return ShareEmailsDomainsComponent
  }
}
