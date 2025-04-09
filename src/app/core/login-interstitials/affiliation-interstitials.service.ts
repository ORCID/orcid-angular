import { Injectable } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { BaseInterstitialService } from './base-interstitial.service'
import { ShareEmailsDomainsDialogComponent } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { TogglzService } from '../togglz/togglz.service'
import { EmailsEndpoint } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { IInterstitialService } from './iinterstitial-service'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import {
  AffilationsComponentDialogInput,
  AffilationsComponentDialogOutput,
  AffiliationsInterstitialDialogComponent,
} from 'src/app/cdk/interstitials/affiliations-interstitial/affiliations-interstitial-dialog.component'

@Injectable({
  providedIn: 'root',
}) // or some TOutput
export class AffiliationInterstitialService
  extends BaseInterstitialService<
    AffilationsComponentDialogInput,
    AffilationsComponentDialogOutput
  >
  implements
    IInterstitialService<
      AffilationsComponentDialogInput,
      AffilationsComponentDialogOutput
    >
{
  // Define the name and toggle for this specific interstitial
  INTERSTITIAL_NAME: InterstitialType = 'AFFILIATION_INTERSTITIAL'
  INTERSTITIAL_TOGGLE = 'LOGIN_AFFILIATION_INTERSTITIAL'

  constructor(
    matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService
  ) {
    // Pass dependencies to the parent
    super(matDialog, togglzService, interstitialsService)
    this.getIntertitialToggle()
  }

  /**
   * Decide if the domain interstitial should be shown.
   * Returns an Observable<boolean> that emits `true` if it *should* show, or `false` if not.
   */
  shouldShowInterstitial(userRecord: UserRecord): Observable<boolean> {
    // Basic checks

    console.log('user has domains', userRecord?.emails?.emailDomains)
    if (!userRecord?.emails?.emailDomains?.length) return of(false)

    const userHasEmploymentAffiliation = userRecord?.affiliations?.some(
      (affiliation) =>
        affiliation.type === 'EMPLOYMENT' &&
        affiliation.affiliationGroup.length > 0
    )

    console.log('userHasEmploymentAffiliation', userHasEmploymentAffiliation)

    if (userHasEmploymentAffiliation) return of(false)
    console.log('user has no affiliation')

    // Finally return true if the interstitial toggle is enabled and the user hasn't seen it yet
   // return this.userHasNotSeemTheInterstitialAndTogglzIsOn()
    return of (true)
  }

  // Return the dialog component that we want to display
  getDialogComponentToShow(): ComponentType<any> {
    return AffiliationsInterstitialDialogComponent
  }

  // Build the data that goes into our dialog
  getDialogDataToShow(
    userRecord: UserRecord
  ): AffilationsComponentDialogInput {
    return { userEmailsJson: userRecord.emails }
  }
}
