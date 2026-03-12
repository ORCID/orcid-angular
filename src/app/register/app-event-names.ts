/**
 * Central enum for all app observability event names (RUM / New Relic).
 * Use with RumJourneyEventService.recordSimpleEvent() or .recordEvent().
 */
export enum AppEventName {
  // ─── Simple events (recordSimpleEvent) ─────────────────────────────────────
  RecordExpandFeaturedWorkClicked = 'record_expand_featured_work_clicked',
  RecordSummaryToggleClicked = 'record_summary_toggle_clicked',
  HttpError = 'http_error',
  ClientError = 'client_error',
  XsrfMissingAfterPreload = 'xsrf_missing_after_preload',

  // ─── Orcid registration journey events ─────────────────────────────────────
  StepASignInButtonClicked = 'step-a-sign-in-button-clicked',
  StepANextButtonClicked = 'step-a-next-button-clicked',
  StepBNextButtonClicked = 'step-b-next-button-clicked',
  StepC2NextButtonClicked = 'step-c2-next-button-clicked',
  StepC2SkipButtonClicked = 'step-c2-skip-button-clicked',
  StepCNextButtonClicked = 'step-c-next-button-clicked',
  StepDNextButtonClicked = 'step-d-next-button-clicked',
  JourneyComplete = 'journey-complete',
}

/** Event name for step back button: `step-${step}-back-button-clicked` */
export function stepBackButtonClickedEvent(step: string): string {
  return `step-${step}-back-button-clicked`
}

/** Event name for step loaded: `step-${step}-loaded` */
export function stepLoadedEvent(step: 'a' | 'b' | 'c2' | 'c' | 'd'): string {
  return `step-${step}-loaded`
}
