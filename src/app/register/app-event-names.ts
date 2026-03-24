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
  SignInSuccess = 'sign_in_success',
  SignInFailure = 'sign_in_failure',
  /** HTTP/network failure on sign-in POST (distinct from application-level sign_in_failure). */
  SignInHttpError = 'sign_in_http_error',

  // ─── Orcid registration journey events ─────────────────────────────────────
  StepASignInButtonClicked = 'step-a-sign-in-button-clicked',
  StepANextButtonClicked = 'step-a-next-button-clicked',
  StepBNextButtonClicked = 'step-b-next-button-clicked',
  StepC2NextButtonClicked = 'step-c2-next-button-clicked',
  StepC2SkipButtonClicked = 'step-c2-skip-button-clicked',
  StepCNextButtonClicked = 'step-c-next-button-clicked',
  StepDNextButtonClicked = 'step-d-next-button-clicked',
  JourneyComplete = 'journey-complete',

  // ─── OAuth authorization journey events ────────────────────────────────────
  OauthErrorPageLoaded = 'error_page_loaded',
  OauthAuthorizationFlagStatus = 'flag_status',
  OauthAuthorizationSuccess = 'authorization_success',
  OauthAuthorizationDenied = 'authorization_denied',
  OauthAuthorizationError = 'authorization_error',
  /** Authorize route guard: redirect_uri validated; navigating away with `#login_required`. */
  OauthAuthorizeGuardLoginRequiredRedirect = 'oauth_authorize_guard_login_required_redirect',
  /** Authorize route guard: redirect_uri failed validation → app 404. */
  OauthAuthorizeGuardInvalidRedirectUri = 'oauth_authorize_guard_invalid_redirect_uri',
  /** Authorize route guard: validateRedirectUri API failed → app 404. */
  OauthAuthorizeGuardValidateRedirectUriError = 'oauth_authorize_guard_validate_redirect_uri_error',
  /** Authorize route guard: OAuth2 `prompt=none` + logged in → `outOfRouterNavigation(target)`. */
  OauthAuthorizeGuardOutOfRouterNavigation = 'oauth_authorize_guard_out_of_router_navigation',
  /**
   * Authorize page: session already has a redirect URL (e.g. `prompt=none` + non-openid scope) —
   * immediate `outOfRouterNavigation` without showing the form. Distinct from guard-only openid silent auth.
   */
  OauthAuthorizePageAlreadyAuthorizedRedirect = 'oauth_authorize_page_already_authorized_redirect',
  /**
   * OAuth request rejected by server (bad scope, redirect_uri, client, etc.) — shown on **`oauth-error`** page.
   * Use **`error_category`** (see `getOauthAuthorizationErrorCategory`) for NRQL facets.
   */
  OauthAuthorizationValidationFailed = 'oauth_authorization_validation_failed',
}

/** Event name for step back button: `step-${step}-back-button-clicked` */
export function stepBackButtonClickedEvent(step: string): string {
  return `step-${step}-back-button-clicked`
}

/** Event name for step loaded: `step-${step}-loaded` */
export function stepLoadedEvent(step: 'a' | 'b' | 'c2' | 'c' | 'd'): string {
  return `step-${step}-loaded`
}
