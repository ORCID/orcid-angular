export interface OauthAuthorizationContext {
  client_id?: string
  redirect_uri?: string
  response_type?: string
  scope?: string
  /** True when user just finished registration before this OAuth flow. */
  justRegistered?: boolean
  /** OAuth auth-server feature flag state for the current flow. */
  OAUTH_AUTHORIZATION?: boolean
  /** True when the user is authorizing while in trusted-individual delegation mode. */
  acting_as_trusted_user?: boolean
  /** True when current delegation context was assigned by admin. */
  delegated_by_admin?: boolean
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
  /** Why logout happened during OAuth authorization journey. */
  oauth_logout_reason?: 'session_logged_out' | 'user_initiated_logout'
}
