import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { from, Observable, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service'

declare const runtimeEnvironment: any

/**
 * XsrfFallbackInterceptor
 *
 * Fallback XSRF interceptor to cover cases where Angular's built-in XSRF
 * support (configured via withXsrfConfiguration) does not attach the header,
 * especially when using the local proxy setup.
 *
 * Behaviour:
 * - For mutating backend calls (POST/PUT/PATCH/DELETE) to ORCID web APIs:
 *   - If an XSRF header is already present, do nothing.
 *   - Otherwise, read the appropriate cookie and set `x-xsrf-token`:
 *     - For requests to AUTH_SERVER origin → `AUTH-XSRF-TOKEN`
 *     - For API_WEB / BASE_URL / relative (e.g. /signin/auth.json) → `XSRF-TOKEN`
 */
@Injectable()
export class XsrfFallbackInterceptor implements HttpInterceptor {
  constructor(private _cookie: CookieService) {}

  private attachXsrf(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      withCredentials: true,
      headers: req.headers.set('x-xsrf-token', token),
    })
  }

  private toAbsoluteUrl(url: string): URL | null {
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

  private sameHost(left: string, right: string): boolean {
    const leftUrl = this.toAbsoluteUrl(left)
    const rightUrl = this.toAbsoluteUrl(right)
    if (!leftUrl || !rightUrl) {
      return false
    }
    return leftUrl.host === rightUrl.host
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const method = (req.method ?? '').toUpperCase()

    // Only care about mutating requests
    if (!method || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle(req)
    }

    // If header is already present and non-empty (either manually or by Angular), leave as-is
    const existingHeader = req.headers.get('x-xsrf-token')?.trim()
    if (existingHeader) {
      return next.handle(req)
    }

    const apiBase = runtimeEnvironment.API_WEB
    const baseUrl = runtimeEnvironment.BASE_URL
    const authBase = runtimeEnvironment.AUTH_SERVER

    // A protocol-relative URL (`//host/path`) also starts with `/` but resolves
    // to a foreign origin, so it must not be treated as a relative request —
    // otherwise the token below is handed to whatever host the attacker names.
    const isRelativeRequest =
      req.url.startsWith('/') && !req.url.startsWith('//')
    const requestUrl = this.toAbsoluteUrl(req.url)
    const isApiHostCall = this.sameHost(req.url, apiBase)
    const isBaseHostCall = this.sameHost(req.url, baseUrl)
    const isAuthHostCall = this.sameHost(req.url, authBase)
    const isSameOriginCall =
      isRelativeRequest || requestUrl?.host === window.location.host

    const isBackendHost =
      isRelativeRequest || isApiHostCall || isBaseHostCall || isAuthHostCall

    if (!isBackendHost) {
      return next.handle(req)
    }

    // Decide which cookie to use based on target *host*, not path.
    // Only the auth server (AUTH_SERVER origin) sets/expects AUTH-XSRF-TOKEN.
    // API_WEB / BASE_URL / relative URLs (e.g. /signin/auth.json) use XSRF-TOKEN.
    const isAuthServerCall = isAuthHostCall

    const primaryCookie = isAuthServerCall ? 'AUTH-XSRF-TOKEN' : 'XSRF-TOKEN'
    const fallbackCookie = isAuthServerCall ? 'XSRF-TOKEN' : 'AUTH-XSRF-TOKEN'
    const token =
      this._cookie.get(primaryCookie) || this._cookie.get(fallbackCookie)

    if (token) {
      return next.handle(this.attachXsrf(req, token))
    }

    // First mutating request can happen before token cookie is materialized.
    // Bootstrap token with csrf.json and retry once with the fresh cookie.
    if (!isAuthServerCall && isSameOriginCall) {
      const csrfUrl = `${apiBase}csrf.json`
      return from(fetch(csrfUrl, { credentials: 'include' })).pipe(
        catchError(() => of(null)),
        switchMap(() => {
          const refreshedToken =
            this._cookie.get('XSRF-TOKEN') ||
            this._cookie.get('AUTH-XSRF-TOKEN')
          if (!refreshedToken) {
            return next.handle(req)
          }
          return next.handle(this.attachXsrf(req, refreshedToken))
        })
      )
    }

    return next.handle(req)
  }
}
