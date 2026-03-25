import { AppEventName } from './app-event-names'
import { JourneyType } from './journeys/types'

/**
 * Simple page actions (`recordSimpleEvent`) that represent a terminal flow outcome
 * (navigation, error surface, or success) where we should flush NR immediately.
 * Routine analytics (e.g. expand clicks) stay out of this set. `http_error` / `client_error`
 * are intentionally excluded to avoid harvest thrash on frequent global errors.
 */
export const TERMINATING_SIMPLE_EVENT_NAMES: ReadonlySet<string> = new Set([
  AppEventName.XsrfMissingAfterPreload,
  AppEventName.SignInSuccess,
  AppEventName.SignInFailure,
  AppEventName.SignInHttpError,
  AppEventName.OauthAuthorizeGuardLoginRequiredRedirect,
  AppEventName.OauthAuthorizeGuardInvalidRedirectUri,
  AppEventName.OauthAuthorizeGuardValidateRedirectUriError,
  AppEventName.OauthAuthorizeGuardOutOfRouterNavigation,
  AppEventName.OauthAuthorizeGuardRedirectToLogin,
  AppEventName.OauthAuthorizeGuardRedirectToMyOrcid,
  AppEventName.OauthAuthorizePageAlreadyAuthorizedRedirect,
  AppEventName.OauthSessionClientHandledErrorRedirectLegacy,
  AppEventName.OauthSessionNavigateAuthorizeErrorLegacy,
  AppEventName.OauthAuthorizeAuthServerErrorBody,
  AppEventName.OauthAuthorizeSwitchDelegatedAccount,
  AppEventName.SignInGuardRedirectToAuthorize,
  AppEventName.SignInGuardRedirectToRegister,
  AppEventName.SignInOauthInvalidGrantLegacy,
  AppEventName.TwoFactorSignInGuardRedirectToMyOrcid,
  AppEventName.RegisterGuardRedirectToAuthorize,
  AppEventName.RegisterPipelineError,
  AppEventName.OauthAuthorizationValidationFailed,
])

export function isTerminatingSimpleEvent(eventName: string): boolean {
  return TERMINATING_SIMPLE_EVENT_NAMES.has(eventName)
}

const OAUTH_TERMINATING_JOURNEY_EVENT_NAMES: ReadonlySet<string> = new Set([
  AppEventName.OauthErrorPageLoaded,
  AppEventName.OauthAuthorizationSuccess,
  AppEventName.OauthAuthorizationDenied,
  AppEventName.OauthAuthorizationError,
  AppEventName.OauthAuthorizationLogout,
])

export function isTerminatingJourneyEvent(
  journeyType: JourneyType,
  eventName: string
): boolean {
  if (journeyType === 'oauth_authorization') {
    return OAUTH_TERMINATING_JOURNEY_EVENT_NAMES.has(eventName)
  }
  if (journeyType === 'orcid_registration') {
    if (eventName === AppEventName.RegisterPipelineError) {
      return true
    }
    if (eventName.endsWith('-error')) {
      return true
    }
    if (eventName === AppEventName.JourneyComplete) {
      return true
    }
    return false
  }
  return false
}
