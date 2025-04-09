import { Injectable } from '@angular/core'
import { Observable, EMPTY, from } from 'rxjs'
import { concatMap, filter, switchMap, take, tap } from 'rxjs/operators'
import { UserRecord } from 'src/app/types/record.local'
import { DomainInterstitialService } from './domain-interstitials.service'
import { IInterstitialService } from './iinterstitial-service'
import { AffiliationInterstitialService } from './affiliation-interstitials.service'
import { AffilationsComponentDialogOutput } from 'src/app/cdk/interstitials/affiliations-interstitial/affiliations-interstitial-dialog.component'
import { ShareEmailsDomainsComponentDialogOutput } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'

@Injectable({
  providedIn: 'root',
})
export class LoginInterstitialsService {
  private alreadyCheckedLoginInterstitials = false

  private interstitialServices: IInterstitialService<
    any,
    AffilationsComponentDialogOutput | ShareEmailsDomainsComponentDialogOutput
  >[] = []

  constructor(
    domainInterstitialService: DomainInterstitialService,
    affiliationInterstitialService: AffiliationInterstitialService
  ) {
    this.interstitialServices = [
      // domainInterstitialService,
      affiliationInterstitialService,
    ]
  }

  /**
   * Main entry point to check whether login interstitials should be displayed.
   * Only the first one that should be shown will be shown.
   * Returns an Observable that completes after an interstitial is shown or if none is shown.
   */
  checkLoginInterstitials(
    userRecord: UserRecord
  ): Observable<
    AffilationsComponentDialogOutput | ShareEmailsDomainsComponentDialogOutput
  > {
    // Basic sanity checks
    if (!this.isValidUserRecord(userRecord)) return EMPTY
    if (this.alreadyCheckedLoginInterstitials) return EMPTY

    this.alreadyCheckedLoginInterstitials = true

    // Evaluate all possible interstitials in sequence
    return from(this.interstitialServices).pipe(
      tap((service) => {
        if (runtimeEnvironment.debugger) {
          console.log(
            'Login Interstitial Manager: ',
            service.INTERSTITIAL_NAME,
            'is being checked'
          )
        }
      }),
      concatMap((service) =>
        service.shouldShowInterstitial(userRecord).pipe(
          tap((result) => {
            if (runtimeEnvironment.debugger) {
              console.log(
                'Login Interstitial Manager: ',
                service.INTERSTITIAL_NAME,
                ' result to display is: ',
                result
              )
            }
          }),
          // Only pass through the service if it *should* show
          filter((shouldShow) => shouldShow),
          // Now actually show it
          switchMap(() => service.showInterstitial(userRecord))
        )
      ),
      // Take only the first service that returns `shouldShow=true`
      take(1)
    )
  }

  /**
   * Valid user check & ensures not impersonating
   */
  private isValidUserRecord(userRecord: UserRecord): boolean {
    if (
      !userRecord?.userInfo ||
      !userRecord?.emails ||
      !userRecord?.affiliations?.length
    )
      return false
    return (
      userRecord.userInfo.REAL_USER_ORCID ===
      userRecord.userInfo.EFFECTIVE_USER_ORCID
    )
  }
}
