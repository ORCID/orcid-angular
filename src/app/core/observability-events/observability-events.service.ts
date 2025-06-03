import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

export type JourneyType =
  | 'orcid_registration'
  | 'orcid_update_emails'
  | 'orcid_with_notifications'
  | 'orcid_without_notifications'
@Injectable({
  providedIn: 'root',
})
export class CustomEventService {
  // Store the start times of each journey
  private journeys: { [key: string]: { startTime: number; attributes: any } } =
    {}

  constructor(@Inject(WINDOW) private window: Window) {}

  /**
   * Starts a new user journey.
   * @param journeyType The type of the journey (e.g., 'orcid_registration', 'orcid_update_emails').
   * @param attributes Additional attributes to store with the journey
   */
  startJourney(journeyType: JourneyType, attributes: any = {}): void {
    // Record the start time and initial attributes
    this.journeys[journeyType] = {
      startTime: Date.now(),
      attributes,
    }

    if (runtimeEnvironment.debugger) {
      console.debug(
        `-> Journey "${journeyType}" started at ${this.journeys[journeyType].startTime}`,
        attributes
      )
    }
  }

  /**
   * Records an event within the journey.
   * @param journeyType The type of the journey (e.g., 'orcid_registration').
   * @param eventName The name of the event to track (e.g., 'page_loaded', 'form_submitted').
   * @param additionalAttributes Any additional attributes related to the event.
   */
  recordEvent(
    journeyType: JourneyType,
    eventName: string,
    additionalAttributes: any = {}
  ): void {
    if (!this.journeys[journeyType]) {
      console.error(`Journey "${journeyType}" not started.`)
      return
    }

    // Calculate time since the start of the journey
    const elapsedTime = Date.now() - this.journeys[journeyType].startTime

    // Combine the journey attributes with additional attributes
    const eventAttributes = {
      ...this.journeys[journeyType].attributes,
      ...additionalAttributes,
      eventName,
      elapsedTime,
    }
    if (typeof (this.window as any).newrelic?.addPageAction === 'function') {
      ;(this.window as any).newrelic.addPageAction(journeyType, eventAttributes)
    }
    // Send the custom event to New Relic

    if (runtimeEnvironment.debugger) {
      console.debug(
        `-> Event "${eventName}" recorded for journey "${journeyType}" with elapsed time ${elapsedTime}ms`,
        eventAttributes
      )
    }
  }

  /**
   * Finishes the user journey.
   * @param journeyType The type of the journey (e.g., 'orcid_registration').
   * @param additionalAttributes Any final attributes or metadata to log at the end of the journey.
   */
  finishJourney(journeyType: string, additionalAttributes: any = {}): void {
    if (!this.journeys[journeyType]) {
      console.error(`Journey "${journeyType}" not started.`)
      return
    }

    // Calculate time since the start of the journey
    const elapsedTime = Date.now() - this.journeys[journeyType].startTime

    // Final event attributes
    const finalAttributes = {
      ...this.journeys[journeyType].attributes,
      ...additionalAttributes,
      eventName: 'journey_finished',
      elapsedTime,
    }

    // Send the final custom event to New Relic
    if (typeof (this.window as any).newrelic?.addPageAction === 'function') {
      ;(this.window as any).newrelic?.addPageAction(
        journeyType,
        finalAttributes
      )
    }

    // Clean up the journey data
    delete this.journeys[journeyType]

    console.debug(
      `Journey "${journeyType}" finished with elapsed time ${elapsedTime}ms`,
      finalAttributes
    )
  }
}
