import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { RecoveryPhoneFormComponent } from 'src/app/cdk/recovery-phone-form/recovery-phone-form.component'
import { WINDOW } from 'src/app/cdk/window/window.service'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { recoveryPhoneElevationExpiry } from 'src/app/core/two-factor-authentication/recovery-phone-elevation'
import { AppEventName } from 'src/app/rum/app-event-names'
import { RecoveryPhoneSaveResponse } from 'src/app/types/two-factor.endpoint'

/**
 * The post-sign-in "Add a recovery phone number" interstitial (PD-5850, R6).
 *
 * Everything that talks to the registry lives in `app-recovery-phone-form`;
 * this component owns the frame around it — the icon, the title, the notice,
 * and the two actions — exactly as the account settings page and the 2FA
 * onboarding step do. The form is driven through `context="INTERSTITIAL"`,
 * which is what tells the backend to accept the send and the save on the
 * strength of the sign in the user has just completed (R6.3): there is no
 * second challenge inside an interstitial.
 */
@Component({
  selector: 'app-recovery-phone-interstitial',
  templateUrl: './recovery-phone-interstitial.component.html',
  styleUrls: [
    './recovery-phone-interstitial.component.scss',
    './recovery-phone-interstitial.component.scss-theme.scss',
  ],
  standalone: false,
})
export class RecoveryPhoneInterstitialComponent implements OnInit, OnDestroy {
  private readonly $destroy = new Subject<void>()

  @Output() finish = new EventEmitter<void>()

  @ViewChild(RecoveryPhoneFormComponent)
  recoveryPhoneForm: RecoveryPhoneFormComponent | undefined

  /**
   * The form renders nothing until the phone field's own translations have
   * loaded, so the spinner stands in for it until it says it is ready.
   */
  formReady = false

  /** Mirrored from the form: the primary action is dead until a code is out. */
  codeSent = false

  /**
   * The seam the other three interstitials use: the base sets a flag that
   * swaps the form out, and the dialog subclass overrides `afterSummit()` to
   * close instead. This interstitial only ever runs as a dialog — it has a
   * `LOGIN_` flag and deliberately no `OAUTH_` one (R6.1) — and /my-orcid
   * shows the "Recovery phone number added" notice (R6.4), so there is no
   * confirmation panel here. The flag is kept so that an inline host added
   * later has the same shape to override as the other three.
   */
  afterSummitStatus = false

  /** Only ever the masked number the registry answered with. */
  addedRecoveryPhone: string | undefined

  // Injected as fields so the dialog subclass only declares what is genuinely
  // its own (MAT_DIALOG_DATA, MatDialogRef)
  private _interstitialObservability = inject(InterstitialObservabilityService)
  private window = inject(WINDOW) as Window

  ngOnInit(): void {
    this.window.scrollTo(0, 0)
    // The registry counts this window from the sign in, which is what admits
    // this flow without a challenge (R6.3). The client has no record of that
    // instant, so it counts from here instead — a few seconds later, and
    // therefore a few seconds longer. Where the two disagree the registry
    // refuses the next request first, and the exit is the same either way
    // (PD-13638).
    recoveryPhoneElevationExpiry(Date.now())
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => this.onElevationExpired())
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }

  onFormReady(): void {
    this.formReady = true
  }

  /** The interstitial owns the primary button; the form owns what it posts. */
  addRecoveryPhone(): void {
    this.recoveryPhoneForm?.save()
  }

  /**
   * No attributes on any of these outcomes. The RUM sanitizer only redacts
   * attribute *keys* matching orcid/email/pid/delegator, so a phone number
   * passed as a value would travel intact (R1.2, R7.2).
   */
  onSaved(response: RecoveryPhoneSaveResponse): void {
    this._interstitialObservability.outcome(AppEventName.InterstitialCompleted)
    this.afterSummit(response?.maskedRecoveryPhoneNumber)
  }

  onFailed(): void {
    this._interstitialObservability.outcome(AppEventName.InterstitialSaveError)
    this.finishIntertsitial()
  }

  /**
   * R6.3 says the registry accepts this flow on the sign in that just
   * happened, so a challenge should never be asked for. If one is asked for
   * anyway the elevation has gone, and nothing inside a dialog that cannot be
   * dismissed can answer it.
   */
  onChallengeRequired(): void {
    this.onElevationExpired()
  }

  /**
   * The one exit for both triggers: the registry's refusal, and the clock
   * reaching the same conclusion first.
   *
   * Reported as its own outcome rather than as a save error, which is what
   * it used to be: nothing was saved and nothing failed, the window simply
   * closed. The interstitial was marked seen when it was shown (R6.1) and is
   * not offered again; the number can still be added from Account settings.
   *
   * Nothing is handed to the record page, so it shows no notice — the same
   * silence as declining (R6.4).
   */
  private onElevationExpired(): void {
    if (this.saving) {
      // The same reason the decline waits: a save already on the wire may be
      // stored, and closing now would report no number for one the registry
      // keeps
      return
    }
    this._interstitialObservability.outcome(
      AppEventName.InterstitialElevationExpired
    )
    this.finishIntertsitial()
  }

  /**
   * Mirrors the form's in-flight save, which is the only thing the decline has
   * to wait for: the POST is already on the wire by then and there is nothing
   * to cancel it with.
   */
  get saving(): boolean {
    return this.recoveryPhoneForm?.saving === true
  }

  /** Distinct from the save-failure exit, so the two are separable in RUM. */
  declineRecoveryPhone(): void {
    // Declining mid-save would close reporting that nothing was added while
    // the registry stores the number anyway, so /my-orcid shows no notice for
    // a number that is now on the account (R6.4). The button carries the same
    // condition; this guard is what holds if a click lands in the same turn.
    if (this.saving) {
      return
    }
    this._interstitialObservability.outcome(AppEventName.InterstitialDismissed)
    this.finishIntertsitial()
  }

  /**
   * Swap the form out. Overridden by the dialog subclass, which closes instead
   * and lets the record show its own notice.
   */
  afterSummit(maskedRecoveryPhoneNumber?: string) {
    this.addedRecoveryPhone = maskedRecoveryPhoneNumber
    this.afterSummitStatus = true
    this.window.scrollTo(0, 0)
  }

  /**
   * Ends the interstitial. The dialog subclass overrides this to hand the
   * masked number back as the dialog result.
   */
  finishIntertsitial(maskedRecoveryPhoneNumber?: string) {
    this.finish.emit()
  }
}
