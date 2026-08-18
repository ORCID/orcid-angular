declare const runtimeEnvironment: any

export const XSRF_COOKIE = 'XSRF-TOKEN'
export const AUTH_XSRF_COOKIE = 'AUTH-XSRF-TOKEN'

export const XSRF_MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

/**
 * Shared URL classification for the two XSRF interceptors, which used to carry
 * their own near-identical copies of these checks.
 *
 * Matching is by *host* rather than by raw string prefix: the configured bases
 * and the URLs Angular hands an interceptor do not always agree on the scheme.
 * API_WEB is protocol relative (`//orcid.org/`) while a service may build an
 * absolute `https://orcid.org/...`, and a prefix test silently skipped those,
 * leaving the request without a token.
 *
 * The auth server is deliberately kept separate from the rest of the backend:
 * it sets and expects `AUTH-XSRF-TOKEN`, and `csrf.json` on API_WEB cannot
 * establish that cookie. Only the fallback interceptor has anything to do for
 * those requests.
 */

/** Absolute form of a request URL, which may be relative or protocol relative. */
export function toAbsoluteUrl(url: string): URL | null {
  try {
    if (!url) return null
    if (url.startsWith('//')) {
      return new URL(`${window.location.protocol}${url}`)
    }
    return new URL(url, window.location.origin)
  } catch (_e) {
    return null
  }
}

function sameHost(left: string, right: string): boolean {
  const leftUrl = toAbsoluteUrl(left)
  const rightUrl = toAbsoluteUrl(right)
  if (!leftUrl || !rightUrl) {
    return false
  }
  return leftUrl.host === rightUrl.host
}

/**
 * The auth server can be a sibling host (`https://auth.orcid.org/`) or, under
 * the local proxy, a path on our own host (`//localhost/auth/`). Comparing the
 * host alone would claim every same-origin call in local development, so the
 * base path has to match too.
 */
export function isAuthServerUrl(url: string): boolean {
  const authBase = toAbsoluteUrl(runtimeEnvironment.AUTH_SERVER)
  const requestUrl = toAbsoluteUrl(url)
  if (!authBase || !requestUrl || authBase.host !== requestUrl.host) {
    return false
  }
  return requestUrl.pathname.startsWith(authBase.pathname)
}

/** API_WEB, BASE_URL or a relative path (e.g. `/signin/auth.json`). */
export function isOrcidWebUrl(url: string): boolean {
  return (
    isRelativeUrl(url) ||
    sameHost(url, runtimeEnvironment.API_WEB) ||
    sameHost(url, runtimeEnvironment.BASE_URL)
  )
}

/** Any ORCID backend, whichever XSRF cookie it uses. */
export function isOrcidBackendUrl(url: string): boolean {
  return isOrcidWebUrl(url) || isAuthServerUrl(url)
}

/** A path-only URL such as `/signin/auth.json`, always served by our backend. */
export function isRelativeUrl(url: string): boolean {
  return !!url && url.startsWith('/')
}

/** Served by the origin the app itself was loaded from. */
export function isSameOriginUrl(url: string): boolean {
  return isRelativeUrl(url) || toAbsoluteUrl(url)?.host === window.location.host
}

/**
 * The cookies whose value belongs in `x-xsrf-token` for this URL, most likely
 * first. The second is a safety net for deployments where the two backends sit
 * on one host and the classification above cannot tell them apart.
 */
export function xsrfCookieNamesFor(url: string): [string, string] {
  return isAuthServerUrl(url)
    ? [AUTH_XSRF_COOKIE, XSRF_COOKIE]
    : [XSRF_COOKIE, AUTH_XSRF_COOKIE]
}
