import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import {
  isOrcidBackendUrl,
  XSRF_MUTATING_METHODS,
  xsrfCookieNameFor,
} from './xsrf-urls'

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
    const method = (req.method ?? '').toUpperCase()

    // Only care about mutating requests
    if (!method || !XSRF_MUTATING_METHODS.includes(method)) {
      return next.handle(req)
    }

    // If header already present (either manually or by Angular), leave as-is
    if (req.headers.has('x-xsrf-token')) {
      return next.handle(req)
    }

    if (!isOrcidBackendUrl(req.url)) {
      return next.handle(req)
    }

    // The cookie is chosen by target *host*, not path — see xsrf-urls.ts
    const token = this._cookie.get(xsrfCookieNameFor(req.url))

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
