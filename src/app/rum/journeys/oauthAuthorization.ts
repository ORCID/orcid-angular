export interface OauthAuthorizationContext {
  client_id?: string
  redirect_uri?: string
  response_type?: string
  scope?: string
}

export interface OauthAuthorizationEventAttributes {
  error?: string
  errorCode?: string
  errorDescription?: string
  OAUTH_AUTHORIZATION?: boolean
}


