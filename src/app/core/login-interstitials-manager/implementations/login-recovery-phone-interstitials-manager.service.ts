import { ComponentType } from '@angular/cdk/overlay'
import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'

import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { RecoveryPhoneInterstitialComponent } from 'src/app/cdk/interstitials/recovery-phone/interstitial-component/recovery-phone-interstitial.component'
import {
  RecoveryPhoneComponentDialogInput,
  RecoveryPhoneInterstitialDialogComponent,
} from 'src/app/cdk/interstitials/recovery-phone/interstitial-dialog-extend/recovery-phone-interstitial-dialog.component'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { UserRecord } from 'src/app/types/record.local'

import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { TogglzService } from '../../togglz/togglz.service'
import { TwoFactorAuthenticationService } from '../../two-factor-authentication/two-factor-authentication.service'
import { RecoveryPhoneComponentDialogOutput } from '../abstractions/dialog-interface'
import { LoginBaseInterstitialManagerService } from '../abstractions/login-abstract-interstitial-manager.service'

@Injectable({
  providedIn: 'root',
})
export class LoginRecoveryPhoneInterstitialManagerService extends LoginBaseInterstitialManagerService<
  RecoveryPhoneComponentDialogInput,
  RecoveryPhoneComponentDialogOutput,
  RecoveryPhoneInterstitialComponent
> {
  QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN =
    QaFlag.forceRecoveryPhoneInterstitialNotSeem
  INTERSTITIAL_NAME: InterstitialType = 'RECOVERY_PHONE_INTERSTITIAL'
  /**
   * One entry per flow, and deliberately only the `LOGIN_` one (R6.1).
   * `getInterstitialTogglz()` picks the flag by prefix, so the missing
   * `OAUTH_` entry resolves to `getStateOf(undefined)` — false — which is the
   * supported way to scope an interstitial to the standard sign-in flow.
   */
  INTERSTITIAL_TOGGLE: TogglzFlag[] = [
    TogglzFlag.LOGIN_RECOVERY_PHONE_INTERSTITIAL,
  ]

  constructor(
    matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService,
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService
  ) {
    // Pass dependencies to the parent. Note the parent takes togglz before
    // interstitials, which is not the order this constructor declares them in.
    super(matDialog, togglzService, interstitialsService, qaFlagService)
  }

  /**
   * R6.1 in full: show this only on a standard sign in, to the account owner,
   * once the two interstitials that come before it in the chain have been
   * seen, when the feature is on, 2FA is active and no recovery number is
   * stored yet.
   *
   * Every failure — an HTTP error, a missing record, a rejected lookup —
   * answers `false`. Eligibility is the only gate early enough to stop an
   * interstitial, because `showInterstitialAsDialog()` records the visit
   * *before* it opens anything: being shown is what marks it seen. A lookup
   * that throws after the chain has committed would charge the user for a view
   * they never got and keep them from ever getting it again, so this has to
   * fail closed.
   */
  userIsElegibleForInterstitial(userRecord: UserRecord): Observable<boolean> {
    // Impersonation and popup windows. The main manager checks these too; the
    // other managers repeat them so each one is answerable on its own.
    if (this.isBlockedContext(userRecord)) {
      return of(false)
    }

    // Cheap gates first: none of the requests below are worth making for a
    // record that is already disqualified by what is in hand
    if (!userRecord?.emails?.emailDomains?.length) {
      return of(false)
    }

    return forkJoin({
      domainsInterstitialSeen: this.interstitialsService
        .getInterstitialsViewed('DOMAIN_INTERSTITIAL')
        .pipe(take(1)),
      affiliationInterstitialSeen: this.interstitialsService
        .getInterstitialsViewed('AFFILIATION_INTERSTITIAL')
        .pipe(take(1)),
      // The feature as a whole, separate from this interstitial's own flag
      // (R7.4), so the interstitial can be turned on and off on its own
      recoveryPhoneFeatureEnabled: this.togglzService
        .getStateOf(TogglzFlag.TWO_FACTOR_RECOVERY_PHONE)
        .pipe(take(1)),
      twoFactorStatus: this._twoFactorAuthenticationService
        .checkState()
        .pipe(take(1)),
    }).pipe(
      map(
        ({
          domainsInterstitialSeen,
          affiliationInterstitialSeen,
          recoveryPhoneFeatureEnabled,
          twoFactorStatus,
        }) =>
          domainsInterstitialSeen &&
          affiliationInterstitialSeen &&
          recoveryPhoneFeatureEnabled &&
          twoFactorStatus?.enabled === true &&
          !twoFactorStatus?.maskedRecoveryPhoneNumber
      ),
      catchError(() => of(false))
    )
  }

  // Return the dialog component that we want to display
  getDialogComponentToShow(): ComponentType<any> {
    return RecoveryPhoneInterstitialDialogComponent
  }

  // The component reads everything it needs from the form, so the dialog
  // carries only its discriminator
  getDialogDataToShow(
    userRecord: UserRecord
  ): RecoveryPhoneComponentDialogInput {
    return {
      type: 'recovery-phone-interstitial',
    }
  }

  /**
   * Required by the base class. Nothing reaches it today: with no `OAUTH_`
   * flag the OAuth chain never gets past `getInterstitialTogglz`.
   */
  getComponentToShow(): ComponentType<RecoveryPhoneInterstitialComponent> {
    return RecoveryPhoneInterstitialComponent
  }

  /**
   * The shared config leaves the dialog without an accessible name and with
   * aria-modal off, so screen readers announce an unnamed dialog and can still
   * reach the record behind it (R6.2, R7.3).
   */
  protected override getDefaultDialogConfig(
    data: RecoveryPhoneComponentDialogInput
  ): MatDialogConfig<RecoveryPhoneComponentDialogInput> {
    return {
      ...super.getDefaultDialogConfig(data),
      ariaLabel: $localize`:@@shared.dialogAriaLabeledByRecoveryPhone:Add a recovery phone number dialog`,
      ariaModal: true,
    }
  }
}
