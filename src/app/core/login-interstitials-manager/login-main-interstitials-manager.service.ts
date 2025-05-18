import { Component, Injectable, Type } from '@angular/core'
import { Observable, EMPTY, from, of } from 'rxjs'
import {
  concatMap,
  filter,
  finalize,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import { UserRecord } from 'src/app/types/record.local'
import { LoginDomainInterstitialManagerService } from './implementations/login-domain-interstitials-manager.service'
import { LoginAffiliationInterstitialManagerService } from './implementations/login-affiliation-interstitials-manager.service'

import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { LoginBaseInterstitialManagerService } from './abstractions/login-abstract-interstitial-manager.service'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from './abstractions/dialog-interface'

import { ComponentType } from '@angular/cdk/overlay'

@Injectable({
  providedIn: 'root',
})
export class LoginMainInterstitialsManagerService {
  private alreadyCheckedLoginInterstitials = false

  private interstitialServices: LoginBaseInterstitialManagerService<
    BaseInterstitialDialogInput,
    BaseInterstitialDialogOutput,
    any
  >[] = []

  constructor(
    private interstitialsService: InterstitialsService,
    LoginDomainInterstitialManagerService: LoginDomainInterstitialManagerService,
    LoginAffiliationInterstitialManagerService: LoginAffiliationInterstitialManagerService
  ) {
    this.interstitialServices = [
      LoginDomainInterstitialManagerService,
      LoginAffiliationInterstitialManagerService,
    ]
  }

  checkLoginInterstitials(
    userRecord: UserRecord
  ): Observable<BaseInterstitialDialogOutput>

  checkLoginInterstitials(
    userRecord: UserRecord,
    opts: { returnComponent: true }
  ): Observable<ComponentType<any>>
  /**
   * Main entry point to check whether login interstitials should be displayed.
   * Only the first one that should be shown will be shown.
   * Returns an Observable that completes after an interstitial is shown or if none is shown.
   */
  checkLoginInterstitials(
    userRecord: UserRecord,
    opts?: { returnComponent: boolean }
  ): Observable<BaseInterstitialDialogOutput | ComponentType<any>> {
    // Basic sanity checks
    if (!this.isValidUserRecord(userRecord)) return EMPTY
    if (this.alreadyCheckedLoginInterstitials) return EMPTY
    this.alreadyCheckedLoginInterstitials = true

    if (
      this.interstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic()
    ) {
      if (runtimeEnvironment.debugger) {
        console.info(
          '[Login Interstitial Manager] Session already checked for login interstitials'
        )
      }
      return EMPTY
    }

    return from(this.interstitialServices).pipe(
      // For each service, run the eligibility logic
      concatMap((service) =>
        service.userIsElegibleForInterstitial(userRecord).pipe(
          tap((result) =>
            this.debugLog(service, 'user is eligible for interstitial:', result)
          ),
          // Only pass through if eligible
          filter(Boolean),

          // Check togglz setting
          switchMap(() => service.getInterstitialTogglz()),
          tap((togglzState) =>
            this.debugLog(service, 'togglz state:', togglzState)
          ),
          // Only pass through if togglz is enabled
          filter(Boolean),

          // Check if already viewed
          switchMap(() => service.getInterstitialViewed()),
          tap((hasBeenViewed) =>
            this.debugLog(service, 'has been viewed:', hasBeenViewed, false)
          ),
          filter((hasBeenViewed) => !hasBeenViewed),
          // Show the interstitial
          switchMap(() => {
            this.debugLog(service, 'showing interstitial')
            return opts?.returnComponent
              ? service.showInterstitialAsComponent()
              : service.showInterstitial(userRecord)
          })
        )
      ),

      // Only the first eligible service that passes all checks is used
      take(1),

      // On complete or error, mark the session as checked
      finalize(() => {
        if (runtimeEnvironment.debugger) {
          console.info(
            '[Login Interstitial Manager] Session checked interstitials logic'
          )
        }
        this.interstitialsService.markCurrentSessionToNoCheckInterstitialsLogic()
      })
    )
  }

  debugLog(
    service: any,
    message: string,
    value?: any,
    valueShouldBe: boolean = true
  ) {
    if (runtimeEnvironment.debugger) {
      console.info(
        '[Login Interstitial Manager]',
        service.INTERSTITIAL_NAME,
        message,
        value !== undefined ? value : '',
        value !== undefined
          ? valueShouldBe === value
            ? '✅'
            : "❌ (won't show)"
          : ''
      )
    }
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
