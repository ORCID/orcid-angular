import { ScopesStrings } from './common.endpoint'

/**
 * Legacy OAuth request info model used across the UI.
 * Kept for backward compatibility with older endpoints and components.
 */
export interface LegacyOauthRequestInfoForm {
  errors: any[]
  scopes: Scope[]
  clientDescription: string
  clientId: string
  clientName: string
  clientEmailRequestReason: string
  memberName: string
  redirectUrl: string
  responseType: 'code' | 'token' | 'bearer'
  stateParam: string
  userId?: string // Only returned from the backend when an existing Orcid id is set thought a authorization URL
  userName?: any
  userOrcid: string
  userEmail: string
  userGivenNames: string
  userFamilyNames: string
  nonce: string
  clientHavePersistentTokens: boolean
  scopesAsString: string
  error: Errors
  errorCode?: string
  errorDescription: string
  forceLogin?: boolean
  oauthState?: string
}

export interface AuthForm {
  clientDescription: string
  clientId: string
  clientName: string
  userName: string
  userOrcid: string
}

export interface Scope {
  name?: string
  value: ScopesStrings
  description?: string
  longDescription?: string
}

type Errors =
  | 'login_required'
  | 'interaction_required'
  | 'invalid_scope'
  | 'invalid_client'
  | 'client_locked'
  | 'oauth_error'
  | 'invalid_request'
  | 'invalid_grant'
  | 'unsupported_response_type'
