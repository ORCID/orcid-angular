import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'

import { RecoveryPhoneFormComponent } from '../../../cdk/recovery-phone-form/recovery-phone-form.component'
import { AppEventName } from '../../../rum/app-event-names'
import { RumJourneyEventService } from '../../../rum/service/customEvent.service'

declare const $localize: any

/**
 * The refusals that end this step: the feature was switched off under the user,
 * or 2FA itself is no longer on. Neither leaves anything for the step to do, so
 * the flow is allowed to carry on to the recovery codes without a number.
 */
export type TwoFactorRecoveryPhoneRefusal = '2FA_DISABLED' | 'FEATURE_DISABLED'

const STEP_ENDING_REFUSALS: readonly string[] = [
  '2FA_DISABLED',
  'FEATURE_DISABLED',
]

/**
 * The one question the page and the step have to agree on: does this code end
 * the step, or is it something the user can still act on? Anything not listed
 * keeps them where they are.
 */
export function endsRecoveryPhoneStep(
  code: string
): code is TwoFactorRecoveryPhoneRefusal {
  return STEP_ENDING_REFUSALS.includes(code)
}

/**
 * The optional recovery phone number step of 2FA onboarding.
 *
 * The form itself lives in `app-recovery-phone-form`; this component is the
 * step around it: the warning notice, the step chrome, and the two ways out,
 * saving a number or skipping it. Both exits report `completed`, because the
 * page behind it only cares that the step is over.
 *
 * A save that fails is not a third way out. Only a refusal that ends the step
 * is reported upwards; everything else keeps the user here with a message and a
 * live primary action, because a step that walks on after a failed save tells
 * the user a number was stored when none was.
 *
 * Nothing here asks for a password: completing step 1 posted a live 2FA code to
 * `2FA/register.json`, which elevates the session for fifteen minutes, so the
 * `ONBOARDING` context is what the backend reads instead of a challenge.
 */
@Component({
  selector: 'app-two-factor-recovery-phone',
  templateUrl: './two-factor-recovery-phone.component.html',
  styleUrls: [
    './two-factor-recovery-phone.component.scss',
    './two-factor-recovery-phone.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class TwoFactorRecoveryPhoneComponent implements OnInit {
  /**
   * Supplied by the page, which is the only thing that knows whether the flow
   * is two or three steps long. The default is the three step wording because
   * this step exists at all only in that flow.
   */
  @Input()
  subtitle = $localize`:@@account.step2Of3RecoveryPhone:Step 2 of 3 - Recovery phone number`

  /** Fired on both exits: a saved number and a skipped step. */
  @Output() completed = new EventEmitter<void>()

  /**
   * Only the refusals that end the step. A save that merely did not land is
   * handled here rather than passed on, so the page never advances on one.
   */
  @Output() failed = new EventEmitter<TwoFactorRecoveryPhoneRefusal>()

  @ViewChild(RecoveryPhoneFormComponent)
  recoveryPhoneForm: RecoveryPhoneFormComponent | undefined

  /** Mirrored from the form: the primary action is dead until a code is out. */
  codeSent = false

  /**
   * A failure the step has to explain itself, because the form reported it
   * instead of rendering a message for it. It is shown under the form, so the
   * form's own field errors stay exactly where they are.
   */
  stepErrorMessage: string | null = null

  constructor(private _observability: RumJourneyEventService) {}

  ngOnInit(): void {
    this._observability.recordSimpleEvent(
      AppEventName.TwoFactorSetupRecoveryPhoneLoaded
    )
  }

  /**
   * Read straight off the form rather than mirrored, so a save that never
   * leaves the browser - an empty or short code - cannot leave the primary
   * button stuck in its disabled state.
   */
  get saving(): boolean {
    return this.recoveryPhoneForm?.saving ?? false
  }

  /**
   * True when the form is already saying something about what just happened.
   * It clears its own errors at the start of every send and every save, so
   * anything set by the time a refusal reaches the step belongs to that
   * refusal and is the message the user should be reading.
   */
  private get formIsExplainingItself(): boolean {
    const form = this.recoveryPhoneForm
    return !!(
      form?.phoneErrorMessage ||
      form?.codeErrorMessage ||
      form?.generalErrorMessage
    )
  }

  /** The step owns the primary button; the form owns what it posts. */
  onPrimaryAction(): void {
    // A retry starts clean, the same way the form clears its own errors
    this.stepErrorMessage = null
    this.recoveryPhoneForm?.save()
  }

  onSaved(): void {
    this._observability.recordSimpleEvent(
      AppEventName.TwoFactorSetupRecoveryPhoneSaved
    )
    this.completed.emit()
  }

  onSkipped(): void {
    this._observability.recordSimpleEvent(
      AppEventName.TwoFactorSetupRecoveryPhoneSkipped
    )
    this.completed.emit()
  }

  /**
   * A refusal from the form. "Failed" is not "step over": only a code that
   * leaves this step with nothing left to do may carry the user past it. The
   * rest - '2FA_DISABLED' and 'FEATURE_DISABLED' aside, that is 'HTTP' - is
   * something a second press can still fix, and stepping over it would hand
   * the user a finished setup they believe holds a recovery number.
   */
  onFailed(error: string): void {
    if (endsRecoveryPhoneStep(error)) {
      this.failed.emit(error)
      return
    }
    if (this.formIsExplainingItself) {
      // The form has its own message for this one; a second one next to it
      // would only argue with it.
      return
    }
    // 'HTTP': the save never reached the registry, so the form has no error
    // code to build a message from and this is the only place one can appear.
    this.stepErrorMessage = $localize`:@@account.recoveryPhoneOnboardingSaveFailed:We could not save your recovery phone number. Please try again, or skip this step and add your number later from your account settings.`
  }

  /**
   * The fifteen minute elevation from step 1 ran out while the user was typing
   * a number, waiting for a text, or away from the tab. Account settings
   * answers this by re-opening its password challenge, but that surface already
   * owns one; growing a password dialog here would ask for a password one
   * screen after a live 2FA code, which is the trade R2.6 exists to refuse. So
   * the step says what happened and leaves both ways out live: press again, or
   * skip and add the number from account settings, which challenges properly.
   */
  onChallengeRequired(): void {
    this.stepErrorMessage = $localize`:@@account.recoveryPhoneOnboardingChallengeExpired:Your recovery phone number was not saved because this step was left open for too long. Please try again, or skip this step and add your number later from your account settings.`
  }
}
