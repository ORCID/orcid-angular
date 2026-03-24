export interface OauthAuthorizationContext {
  client_id?: string
  redirect_uri?: string
  response_type?: string
  scope?: string
  /** True when the user is authorizing while in trusted-individual delegation mode. */
  acting_as_trusted_user?: boolean
  /** Effective ORCID of the active delegated account (when present). */
  effective_user_orcid?: string
  /** Real signed-in ORCID behind the delegated account context (when present). */
  real_user_orcid?: string
  /** True when current delegation context was assigned by admin. */
  delegated_by_admin?: boolean
  /**
   * Full OAuth route query string (`key=value&…`), sorted keys.
   * Use this when individual fields are not enough (e.g. `state`, `prompt`, `nonce`).
   */
  oauth_query_string?: string
}

export interface OauthAuthorizationEventAttributes {
  error?: string
  errorCode?: string
  errorDescription?: string
  OAUTH_AUTHORIZATION?: boolean
  /** Registry `authorize.json` vs auth server `oauth2/authorize` (HTTP failure path). */
  oauth_authorize_endpoint?: 'legacy' | 'auth_server'
  /** Approve vs deny action that triggered the failed request. */
  oauth_authorize_approved?: boolean
  /** Failed authorize request HTTP status (when available). */
  authorize_http_status?: number
  authorize_http_status_text?: string
  /** Path + query of the failed authorize request URL. */
  authorize_request_url_path_and_query?: string
}
