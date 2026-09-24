import { Component, Inject, Injectable, Type } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'

import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { TogglzService } from '../../togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { LoginBaseInterstitialManagerService } from '../abstractions/login-abstract-interstitial-manager.service'
import { AffiliationInterstitialOrganizationService } from '../affiliation-interstitial-organization.service'
import { AffiliationsInterstitialComponent } from 'src/app/cdk/interstitials/affiliations-interstitial/interstitial-component/affiliations-interstitial.component'
import {
  AffilationsComponentDialogInput,
  AffilationsComponentDialogOutput,
  AffiliationsInterstitialDialogComponent,
} from 'src/app/cdk/interstitials/affiliations-interstitial/interstitial-dialog-extend/affiliations-interstitial-dialog.component'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class LoginAffiliationInterstitialManagerService extends LoginBaseInterstitialManagerService<
  AffilationsComponentDialogInput,
  AffilationsComponentDialogOutput,
  AffiliationsInterstitialComponent
> {
  QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN =
    QaFlag.forceAffiliationInterstitialNotSeem
  INTERSTITIAL_NAME: InterstitialType = 'AFFILIATION_INTERSTITIAL'
  INTERSTITIAL_TOGGLE: TogglzFlag[] = [
    TogglzFlag.LOGIN_AFFILIATION_INTERSTITIAL,
    TogglzFlag.OAUTH_AFFILIATION_INTERSTITIAL,
  ]

  constructor(
    matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService,
    private affiliationOrganization: AffiliationInterstitialOrganizationService,
    @Inject(WINDOW) private _window: Window
  ) {
    // Pass dependencies to the parent
    super(matDialog, togglzService, interstitialsService, qaFlagService)
  }

  /**
   * Decide if the domain interstitial should be shown.
   * Returns an Observable<boolean> that emits `true` if it *should* show, or `false` if not.
   */
  userIsElegibleForInterstitial(userRecord: UserRecord): Observable<boolean> {
    // Basic checks

    if (!userRecord?.emails?.emailDomains?.length) return of(false)

    const isImpersonation = !(
      userRecord?.userInfo?.REAL_USER_ORCID ===
      userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    )

    const insideAnIframe = !!this._window.opener

    const userHasEmploymentAffiliation = userRecord?.affiliations?.some(
      (affiliation) =>
        affiliation.type === 'EMPLOYMENT' &&
        affiliation.affiliationGroup.length > 0
    )

    if (userHasEmploymentAffiliation || isImpersonation || insideAnIframe)
      return of(false)

    // The interstitial's entire offer is "we think you work at X, add it to
    // your record". Without a single X to name there is nothing to offer, so
    // it must not open at all — eligibility is the only gate early enough to
    // stop it, since being shown is what marks it as seen.
    //
    // A domain matching no ROR and a domain matching several both resolve to
    // `undefined` here, which are exactly the two cases reported.
    return this.affiliationOrganization
      .resolveFromDomains(userRecord.emails.emailDomains)
      .pipe(map((organization) => !!organization))
  }

  // Return the dialog component that we want to display
  getDialogComponentToShow(): ComponentType<any> {
    return AffiliationsInterstitialDialogComponent
  }

  // Build the data that goes into our dialog
  getDialogDataToShow(userRecord: UserRecord): AffilationsComponentDialogInput {
    return {
      type: 'affiliation-interstitial',
    }
  }

  getComponentToShow(): ComponentType<AffiliationsInterstitialComponent> {
    return AffiliationsInterstitialComponent
  }
}
