import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
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

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const method = req.method.toUpperCase()

    // Only care about mutating requests
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle(req)
    }

    // If header already present (either manually or by Angular), leave as-is
    if (req.headers.has('x-xsrf-token')) {
      return next.handle(req)
    }

    const apiBase = runtimeEnvironment.API_WEB
    const baseUrl = runtimeEnvironment.BASE_URL
    const authBase = runtimeEnvironment.AUTH_SERVER

    const isBackendHost =
      req.url.startsWith(apiBase) ||
      req.url.startsWith(baseUrl) ||
      req.url.startsWith('/') ||
      req.url.startsWith(authBase)

    if (!isBackendHost) {
      return next.handle(req)
    }

    // Decide which cookie to use based on target *host*, not path.
    // Only the auth server (AUTH_SERVER origin) sets/expects AUTH-XSRF-TOKEN.
    // API_WEB / BASE_URL / relative URLs (e.g. /signin/auth.json) use XSRF-TOKEN.
    const isAuthServerCall = req.url.startsWith(authBase)

    const cookieName = isAuthServerCall ? 'AUTH-XSRF-TOKEN' : 'XSRF-TOKEN'
    const token = this._cookie.get(cookieName)

    if (!token) {
      return next.handle(req)
    }

    const cloned = req.clone({
      withCredentials: true,
      headers: req.headers.set('x-xsrf-token', token),
    })

    return next.handle(cloned)
  }
}
