import { HttpErrorResponse } from '@angular/common/http'
import { httpErrorEventAttrs } from './http-error-event-attrs'

describe('httpErrorEventAttrs', () => {
  it('adds request and page context for status 0', () => {
    const err = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: '/oauth/authorize',
      error: { isTrusted: true, type: 'error' },
    })

    const attrs = httpErrorEventAttrs(err, {
      browserSupport: '',
      csrf: '',
      xsrfCookiePresent: true,
      authXsrfCookiePresent: false,
      csrfCookieState: 'xsrf_only',
      currentOrigin: 'https://orcid.org',
      currentHost: 'orcid.org',
      currentPath: '/signin',
      referrerHost: 'accounts.google.com',
      isOnline: true,
    })

    expect(attrs.requestPath).toBe('/oauth/authorize')
    expect(attrs.requestHost).toBe('orcid.org')
    expect(attrs.requestOriginType).toBe('same_origin')
    expect(attrs.currentPath).toBe('/signin')
    expect(attrs.referrerHost).toBe('accounts.google.com')
    expect(attrs.xsrfCookiePresent).toBeTrue()
    expect(attrs.authXsrfCookiePresent).toBeFalse()
    expect(attrs.csrfCookieState).toBe('xsrf_only')
    expect(attrs.statusZeroCause).toBe('network_or_cors')
    expect(attrs.errorBody).toBe('{"isTrusted":true,"type":"error"}')
    expect(attrs.errorBodyType).toBe('object:Object')
  })

  it('classifies offline status 0 correctly', () => {
    const err = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: 'https://api.orcid.org/oauth/token',
      error: { isTrusted: true },
    })

    const attrs = httpErrorEventAttrs(err, {
      browserSupport: 'unsupported',
      csrf: 'no-XSRF',
      xsrfCookiePresent: false,
      authXsrfCookiePresent: false,
      csrfCookieState: 'none',
      currentOrigin: 'https://orcid.org',
      isOnline: false,
    })

    expect(attrs.requestOriginType).toBe('cross_origin')
    expect(attrs.csrfCookieState).toBe('none')
    expect(attrs.statusZeroCause).toBe('offline')
    expect(attrs.errorBody).toBe('{"isTrusted":true}')
  })

  it('does not set statusZeroCause for non-zero statuses', () => {
    const err = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      url: '/api/account',
      error: 'boom',
    })

    const attrs = httpErrorEventAttrs(err, {
      browserSupport: '',
      csrf: '',
      currentOrigin: 'https://orcid.org',
      isOnline: true,
    })

    expect(attrs.errorBodyType).toBe('string')
    expect(attrs.errorBody).toBe('boom')
    expect(attrs.statusZeroCause).toBeUndefined()
  })
})
