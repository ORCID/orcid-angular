import { Injectable } from '@angular/core'

import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { AppEventName } from '../../rum/app-event-names'
import { RumJourneyEventService } from '../../rum/service/customEvent.service'
import { InterstitialEventAttributes } from '../../rum/journeys/interstitial'

/**
 * Funnel instrumentation for the sign-in interstitials.
 *
 * `shown` is emitted from the shared manager, so every interstitial reports the
 * same denominator; outcomes are emitted by the interstitial components. The
 * journey ties the two together with `system_journeyId` and gives
 * `system_elapsedMs` as time to decision.
 *
 * Attribute keys must not contain orcid/email/pid/delegator — those are redacted
 * by the RUM sanitizer. Addresses are never sent.
 */
@Injectable({
  providedIn: 'root',
})
export class InterstitialObservabilityService {
  constructor(private _observability: RumJourneyEventService) {}

  shown(interstitialName: InterstitialType): void {
    this._observability.startJourney('interstitial', { interstitialName })
    this._observability.recordEvent(
      'interstitial',
      AppEventName.InterstitialShown
    )
  }

  /**
   * Any event between `shown` and `closed`. Kept generic so a new interstitial
   * (or a new outcome) needs no method here and no extra spy in its specs.
   */
  outcome(eventName: AppEventName, attrs?: InterstitialEventAttributes): void {
    this._observability.recordEvent('interstitial', eventName, attrs)
  }

  /** Closes the journey once the dialog is gone, whatever the outcome was. */
  closed(): void {
    this._observability.finishJourney('interstitial')
  }
}
