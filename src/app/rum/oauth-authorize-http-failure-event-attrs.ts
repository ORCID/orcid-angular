import { HttpErrorResponse } from '@angular/common/http'
import { formatHttpErrorForRum } from './format-http-error-for-rum'
import { OauthAuthorizationEventAttributes } from './journeys/oauthAuthorization'

/**
 * Attributes for journey `authorization_error` when the authorize HTTP call fails.
 * Replaces the separate simple event `oauth_authorize_http_error` (single funnel signal).
 */
export function oauthAuthorizeHttpFailureEventAttrs(
  error: unknown,
  endpoint: 'legacy' | 'auth_server',
  approved: boolean,
  oauthAuthorizationTogglz: boolean
): OauthAuthorizationEventAttributes {
  const attrs: OauthAuthorizationEventAttributes = {
    OAUTH_AUTHORIZATION: oauthAuthorizationTogglz,
    oauth_authorize_endpoint: endpoint,
    oauth_authorize_approved: approved,
    error: formatHttpErrorForRum(error),
  }

  if (error instanceof HttpErrorResponse) {
    attrs.authorize_http_status = error.status
    attrs.authorize_http_status_text = error.statusText
    attrs.authorize_request_url_path_and_query =
      requestUrlPathAndQueryForRum(error.url)
  } else if (
    error &&
    typeof error === 'object' &&
    typeof (error as HttpErrorResponse).status === 'number'
  ) {
    const o = error as HttpErrorResponse
    attrs.authorize_http_status = o.status
    attrs.authorize_http_status_text = o.statusText
    attrs.authorize_request_url_path_and_query = requestUrlPathAndQueryForRum(
      o.url
    )
  }

  return attrs
}

function requestUrlPathAndQueryForRum(
  url: string | null | undefined
): string | undefined {
  if (!url) {
    return undefined
  }
  try {
    const u = new URL(url)
    return u.pathname + u.search
  } catch {
    return url
  }
}
