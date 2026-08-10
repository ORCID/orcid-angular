declare const runtimeEnvironment: any

/**
 * Shared URL classification for the two XSRF interceptors, which used to carry
 * their own near-identical copies of these checks.
 *
 * The auth server is deliberately kept separate from the rest of the backend:
 * it sets and expects `AUTH-XSRF-TOKEN`, and `csrf.json` on API_WEB cannot
 * establish that cookie. Only the fallback interceptor has anything to do for
 * those requests.
 */
export function isAuthServerUrl(url: string): boolean {
  return url.startsWith(runtimeEnvironment.AUTH_SERVER)
}

/** API_WEB, BASE_URL or a relative path (e.g. `/signin/auth.json`). */
export function isOrcidWebUrl(url: string): boolean {
  return (
    url.startsWith(runtimeEnvironment.API_WEB) ||
    url.startsWith(runtimeEnvironment.BASE_URL) ||
    url.startsWith('/')
  )
}

/** Any ORCID backend, whichever XSRF cookie it uses. */
export function isOrcidBackendUrl(url: string): boolean {
  return isOrcidWebUrl(url) || isAuthServerUrl(url)
}

/** The cookie whose value belongs in `x-xsrf-token` for this URL. */
export function xsrfCookieNameFor(url: string): string {
  return isAuthServerUrl(url) ? 'AUTH-XSRF-TOKEN' : 'XSRF-TOKEN'
}

export const XSRF_MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
