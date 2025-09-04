import { OrcidRegistrationContext, OrcidRegistrationEventAttributes } from './orcidRegistration'
import { OauthAuthorizationContext, OauthAuthorizationEventAttributes } from './oauthAuthorization'
import { OrcidNotificationsContext, OrcidNotificationsEventAttributes } from './orcidNotifications'
export type JourneyType =
  | 'orcid_registration'
  | 'orcid_notifications'
  | 'oauth_authorization'

// Base helpers
export type JourneyContextMap = {
  orcid_registration: OrcidRegistrationContext
  orcid_notifications: OrcidNotificationsContext
  oauth_authorization: OauthAuthorizationContext
}

export type EventAttrMap = {
  orcid_registration: OrcidRegistrationEventAttributes
  orcid_notifications: OrcidNotificationsEventAttributes
  oauth_authorization: OauthAuthorizationEventAttributes
}

// Per-journey interfaces are re-exported from individual journey files
export { OrcidRegistrationContext, OrcidRegistrationEventAttributes } from './orcidRegistration'
export { OauthAuthorizationContext, OauthAuthorizationEventAttributes } from './oauthAuthorization'
export { OrcidNotificationsContext, OrcidNotificationsEventAttributes } from './orcidNotifications'


