import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { first, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { ApplicationRoutes } from '../../../constants'
import { TogglzFlag } from '../../../types/config.endpoint'
import { Router } from '@angular/router'
import { endsRecoveryPhoneStep } from '../../components/two-factor-recovery-phone/two-factor-recovery-phone.component'

declare const $localize: any

/** The three steps the flow can be on; the middle one only ever with the flag on. */
export type TwoFactorSetupStep = 'enable' | 'recoveryPhone' | 'recoveryCodes'

@Component({
  selector: 'app-two-factor-setup-module',
  templateUrl: './two-factor-setup.component.html',
  styleUrls: [
    './two-factor-setup.component.scss',
    './two-factor-setup.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class TwoFactorSetupComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  platform: PlatformInfo
  qrCodeUrl: string
  applicationRoutes = ApplicationRoutes
  step: TwoFactorSetupStep = 'enable'
  backupCodes: string
  backupCodesClipboard: string

  /**
   * Resolved once, on init rather than on the way out of step 1, because step
   * 1 already has to say whether it is one of two steps or one of three.
   */
  recoveryPhoneEnabled = false

  /**
   * Nothing renders until the flag has been read. The subtitles below are
   * written for the two step flow, and on a cold load the flag arrives after
   * the first render, so without this the user watches "Step 1 of 2" renumber
   * itself to "Step 1 of 3" under them. A frame with nothing in it is cheaper
   * than a step that changes what it says.
   */
  flagResolved = false

  /**
   * The step subtitles live here because only the page knows how long the flow
   * is. Both wordings keep their own id: the two step strings are the ones the
   * registry has already been translated with, and they are what the flag-off
   * flow keeps showing.
   */
  enableSubtitle = $localize`:@@account.step1AuthenticationApp:Step 1 of 2 - Authentication app`
  recoveryPhoneSubtitle = $localize`:@@account.step2Of3RecoveryPhone:Step 2 of 3 - Recovery phone number`
  recoveryCodesSubtitle = $localize`:@@account.step2RecoveryCodes:Step 2 of 2 - 2FA recovery codes`

  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private _togglz: TogglzService,
    private _twoFactorService: TwoFactorAuthenticationService,
    private _platformInfo: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._twoFactorService
      .checkState()
      .pipe(first())
      .subscribe((result) => {
        if (result.enabled) {
          this.router.navigate(['/' + this.applicationRoutes.account])
        }
      })

    this._togglz
      .getStateOf(TogglzFlag.TWO_FACTOR_RECOVERY_PHONE)
      .pipe(first(), takeUntil(this.$destroy))
      .subscribe({
        next: (enabled) => {
          this.recoveryPhoneEnabled = enabled
          if (enabled) {
            this.enableSubtitle = $localize`:@@account.step1Of3AuthenticationApp:Step 1 of 3 - Authentication app`
            this.recoveryCodesSubtitle = $localize`:@@account.step3Of3RecoveryCodes:Step 3 of 3 - 2FA recovery codes`
          }
          this.flagResolved = true
        },
        error: () => {
          // A flag that cannot be read is a flag that is off: the two step flow
          // is the one that works without it, and either is better than a page
          // that never renders at all.
          this.flagResolved = true
        },
      })

    this._platformInfo
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  twoFactorEnabled($event: {
    backupCodes?: string
    backupCodesClipboard?: string
  }) {
    this.backupCodes = $event.backupCodes
    this.backupCodesClipboard = $event.backupCodesClipboard
    this.step = this.recoveryPhoneEnabled ? 'recoveryPhone' : 'recoveryCodes'
  }

  /** Saved or skipped: either way the recovery phone step is behind us. */
  recoveryPhoneCompleted(): void {
    this.step = 'recoveryCodes'
  }

  /**
   * The registry refused the step in a way it cannot come back from: the
   * feature went off, or 2FA itself did. The codes are the part of setup the
   * user cannot be allowed to lose, so the flow moves on rather than stopping
   * on a step that can no longer do anything; the number can be added later
   * from Account settings.
   *
   * A save that merely did not land never arrives here - the step keeps the
   * user on it and offers the retry - and the guard below is what makes that
   * true of this page too, whatever a later caller decides to report.
   */
  recoveryPhoneFailed(reason: string): void {
    if (!endsRecoveryPhoneStep(reason)) {
      return
    }
    this.step = 'recoveryCodes'
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
