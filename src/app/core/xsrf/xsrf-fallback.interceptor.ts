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
import {
  isAuthServerUrl,
  isOrcidBackendUrl,
  isSameOriginUrl,
  XSRF_MUTATING_METHODS,
  xsrfCookieNamesFor,
} from './xsrf-urls'

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
 *   - If no cookie exists yet, bootstrap one from csrf.json and retry once.
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

  private readToken(url: string): string {
    const [primary, fallback] = xsrfCookieNamesFor(url)
    return this._cookie.get(primary) || this._cookie.get(fallback)
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const method = (req.method ?? '').toUpperCase()

    // Only care about mutating requests
    if (!method || !XSRF_MUTATING_METHODS.includes(method)) {
      return next.handle(req)
    }

    // If header is already present and non-empty (either manually or by Angular), leave as-is
    const existingHeader = req.headers.get('x-xsrf-token')?.trim()
    if (existingHeader) {
      return next.handle(req)
    }

    if (!isOrcidBackendUrl(req.url)) {
      return next.handle(req)
    }

    // Which cookie belongs on this request is a question about the target
    // backend, not about the endpoint — see xsrf-urls.ts
    const token = this.readToken(req.url)

    if (token) {
      return next.handle(this.attachXsrf(req, token))
    }

    // First mutating request can happen before token cookie is materialized.
    // Bootstrap token with csrf.json and retry once with the fresh cookie.
    // The auth server is skipped: csrf.json cannot establish AUTH-XSRF-TOKEN.
    if (!isAuthServerUrl(req.url) && isSameOriginUrl(req.url)) {
      const csrfUrl = `${runtimeEnvironment.API_WEB}csrf.json`
      return from(fetch(csrfUrl, { credentials: 'include' })).pipe(
        catchError(() => of(null)),
        switchMap(() => {
          const refreshedToken = this.readToken(req.url)
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
