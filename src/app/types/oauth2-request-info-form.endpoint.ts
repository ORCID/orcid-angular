import { LegacyOauthRequestInfoForm, Scope } from './request-info-form.endpoint'
import { ScopesStrings } from './common.endpoint'

/**
 * Data model returned by the oauth2/authorize endpoint (Auth Server).
 * Each field documents where it is used in the UI.
 */
export interface Oauth2RequestInfoForm {
  skip_authorization?: boolean
  redirect_url?: string
  error?: string
  errorCode?: string
  errorDescription?: string
  // New auth server error code
  error_code?: string
  // New auth server error description
  error_description?: string
  scopes?: string
  clientId?: string
  clientName?: string
  clientDescription?: string
  userOrcid?: string
  userName?: string
  state?: string
}

/**
 * Map the oauth2/authorize response model to the legacy UI model.
 */
export function mapOauth2RequestToLegacy(
  source: Oauth2RequestInfoForm
): LegacyOauthRequestInfoForm {
  const scopesArray: Scope[] = (source.scopes || '')
    .split(' ')
    .filter((s) => !!s)
    .map((s) => ({ value: s as ScopesStrings }))

  const legacy: LegacyOauthRequestInfoForm = {
    errors: null,
    scopes: scopesArray,
    clientDescription: source.clientDescription || '',
    clientId: source.clientId || '',
    clientName: source.clientName || '',
    clientEmailRequestReason: null,
    memberName: '',
    redirectUrl: '',
    // responseType is only known after redirect URL construction. Keep unset.
    responseType: undefined as any,
    stateParam: source.state || '',
    userId: undefined,
    userName: source.userName || '',
    userOrcid: source.userOrcid || '',
    userEmail: '',
    userGivenNames: '',
    userFamilyNames: '',
    nonce: null,
    clientHavePersistentTokens: null,
    scopesAsString: null,
    error: (source.error as any) || null,
    errorCode: source.errorCode || source.error_code || null,
    errorDescription: source.errorDescription || source.error_description || '',
    forceLogin: false,
    oauthState: source.state || '',
  }

  // If skip_authorization is true, ensure redirectUrl is set for the UI
  if (source.skip_authorization && source.redirect_url) {
    legacy.redirectUrl = source.redirect_url
  }

  return legacy
}
