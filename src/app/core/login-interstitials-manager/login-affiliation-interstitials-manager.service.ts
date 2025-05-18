import { Component, Injectable, Type } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { LoginBaseInterstitialManagerService } from './login-abstract-interstitial-manager.service'
import { ShareEmailsDomainsDialogComponent } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { TogglzService } from '../togglz/togglz.service'
import { EmailsEndpoint } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import {
  AffilationsComponentDialogInput,
  AffilationsComponentDialogOutput,
  AffiliationsInterstitialDialogComponent,
} from 'src/app/cdk/interstitials/affiliations-interstitial/affiliations-interstitial-dialog.component'
import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { AffiliationsInterstitialComponent } from 'src/app/cdk/interstitials/affiliations-interstitial/affiliations-interstitial.component'

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
  INTERSTITIAL_TOGGLE = 'LOGIN_AFFILIATION_INTERSTITIAL'

  constructor(
    matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService
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

    const userHasEmploymentAffiliation = userRecord?.affiliations?.some(
      (affiliation) =>
        affiliation.type === 'EMPLOYMENT' &&
        affiliation.affiliationGroup.length > 0
    )

    if (userHasEmploymentAffiliation) return of(false)
    return of(true)
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
