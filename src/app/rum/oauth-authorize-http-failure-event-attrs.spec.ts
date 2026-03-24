import { HttpErrorResponse } from '@angular/common/http'
import { oauthAuthorizeHttpFailureEventAttrs } from './oauth-authorize-http-failure-event-attrs'

describe('oauthAuthorizeHttpFailureEventAttrs', () => {
  it('includes endpoint, status, and path for HttpErrorResponse', () => {
    const err = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: 'https://example.com/oauth2/authorize',
    })
    const attrs = oauthAuthorizeHttpFailureEventAttrs(
      err,
      'auth_server',
      true,
      true
    )
    expect(attrs.oauth_authorize_endpoint).toBe('auth_server')
    expect(attrs.oauth_authorize_approved).toBe(true)
    expect(attrs.OAUTH_AUTHORIZATION).toBe(true)
    expect(attrs.authorize_http_status).toBe(0)
    expect(attrs.authorize_request_url_path_and_query).toContain('/oauth2/authorize')
  })
})
