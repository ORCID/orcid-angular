import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { switchMap, take } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { WINDOW } from 'src/app/cdk/window'
import { Platform } from '@angular/cdk/platform'

/**
 * FirefoxXsrfPreloadInterceptor
 *
 * Firefox-only workaround: Firefox ignores XSRF cookies set via 302 redirects for endpoints like
 * /account/nameForm.json and /inbox/unreadCount.json.
 * Other browsers work fine, so this interceptor runs ONLY on Firefox.
 *
 * Behavior:
 * - For the first backend XHR, if no XSRF-TOKEN cookie is present, issue one-time GET to cors.json
 * - Gate subsequent requests until this completes
 * - If after preload the XSRF cookie is still missing, log a simple RUM event and hard reload the page
 */
@Injectable()
export class FirefoxXsrfPreloadInterceptor implements HttpInterceptor {
  private isLoading = false
  private loaded = false
  private gate$ = new Subject<void>()
  private readonly isFirefox: boolean

  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private _cookie: CookieService,
    private _observability: RumJourneyEventService,
    @Inject(WINDOW) private window: Window,
    platform: Platform
  ) {
    this.isFirefox = platform.FIREFOX
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isFirefox) {
      return next.handle(req)
    }

    const apiBase = runtimeEnvironment.API_WEB
    const baseUrl = runtimeEnvironment.BASE_URL

    const isCorsJson = req.url.includes('cors.json')
    const looksBackendJson = req.url.includes('.json')
    const isBackendHost =
      req.url.startsWith(apiBase) ||
      req.url.startsWith(baseUrl) ||
      req.url.startsWith('/')
    const isBackendCall = (looksBackendJson || isBackendHost) && !isCorsJson

    // If cookie already present, no need to preload
    if (!this.loaded && this.hasXsrfCookie()) {
      this.loaded = true
    }

    if (!isBackendCall || this.loaded) {
      return next.handle(req)
    }

    // Kick off a one-time cors.json preload
    if (!this.isLoading) {
      this.isLoading = true
      // Use fetch to avoid re-entering HttpClient interceptors chain
      const url = `${apiBase}cors.json`
      fetch(url, { credentials: 'include' })
        .catch(() => {})
        .finally(() => {
          this.loaded = true
          this.isLoading = false
          // If still no XSRF cookie, report and reload
          if (!this.hasXsrfCookie()) {
            try {
              this._observability.recordSimpleEvent('xsrf_missing_after_preload', {
                error: 'xsrf_missing',
                errorDescription: 'XSRF-TOKEN missing after cors.json preload',
                browser: 'firefox',
              })
            } catch (_) {}
            // Force full reload to retry cookie issuance
            try {
              this.window.location.reload()
            } catch (_) {}
          }
          this.gate$.next()
          this.gate$.complete()
        })
    }

    // Wait until cors.json preload completes, then proceed with the original request
    return this.gate$.pipe(take(1), switchMap(() => next.handle(req)))
  }

  private hasXsrfCookie(): boolean {
    return !!this._cookie.get('XSRF-TOKEN')
  }
}


