import { Inject, Injectable } from '@angular/core'
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
import { AppEventName } from 'src/app/rum/app-event-names'
import { WINDOW } from 'src/app/cdk/window'
import { Platform } from '@angular/cdk/platform'

/**
 * XsrfPreloadInterceptor
 *
 * Makes sure an XSRF-TOKEN cookie exists before the first backend call.
 *
 * This started as a Firefox-only workaround (Firefox ignores XSRF cookies set
 * via 302 redirects for endpoints like /account/nameForm.json), but the same
 * gap hurts every browser: with no cookie yet, the first mutating request goes
 * out without the `x-xsrf-token` header, gets a 403, and only establishes the
 * cookie as a side effect. That is why signing in could take two attempts, and
 * why one-shot POSTs such as account/addInterstitialFlag simply failed.
 *
 * Behaviour:
 * - For the first backend XHR, if no XSRF-TOKEN cookie is present, issue a
 *   one-time GET to csrf.json
 * - Gate subsequent requests until this completes
 * - If the cookie is still missing afterwards, log a RUM event and hard reload
 *   once. The reload is guarded by a session flag so it can never loop.
 */
@Injectable()
export class XsrfPreloadInterceptor implements HttpInterceptor {
  /** Session flag so a failed preload can reload at most once. */
  static readonly RELOAD_GUARD_KEY = 'xsrf-preload-reloaded'

  private isLoading = false
  private loaded = false
  private gate$ = new Subject<void>()

  constructor(
    private _cookie: CookieService,
    private _observability: RumJourneyEventService,
    @Inject(WINDOW) private window: Window,
    private platform: Platform
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiBase = runtimeEnvironment.API_WEB
    const baseUrl = runtimeEnvironment.BASE_URL

    const isCorsJson = req.url.includes('cors.json')
    // csrf.json must never gate on itself
    const isCsrfJson = req.url.includes('csrf.json')
    const looksBackendJson = req.url.includes('.json')
    const isBackendHost =
      req.url.startsWith(apiBase) ||
      req.url.startsWith(baseUrl) ||
      req.url.startsWith('/')
    const isBackendCall =
      (looksBackendJson || isBackendHost) && !isCorsJson && !isCsrfJson

    // If cookie already present, no need to preload
    if (!this.loaded && this.hasXsrfCookie()) {
      this.loaded = true
    }

    if (!isBackendCall || this.loaded) {
      return next.handle(req)
    }

    // Kick off a one-time csrf.json preload
    if (!this.isLoading) {
      this.isLoading = true
      // Use fetch to avoid re-entering HttpClient interceptors chain
      const url = `${apiBase}csrf.json`
      fetch(url, { credentials: 'include' })
        .catch(() => {})
        .finally(() => {
          this.loaded = true
          this.isLoading = false
          if (!this.hasXsrfCookie()) {
            this.reportAndReloadOnce()
          }
          this.gate$.next()
          this.gate$.complete()
        })
    }

    // Wait until csrf.json preload completes, then proceed with the original request
    return this.gate$.pipe(
      take(1),
      switchMap(() => next.handle(req))
    )
  }

  /**
   * Reloading is a last resort. Without the guard a backend that never issues
   * the cookie would put the browser in a reload loop.
   */
  private reportAndReloadOnce(): void {
    let alreadyReloaded = false
    try {
      alreadyReloaded =
        this.window.sessionStorage.getItem(
          XsrfPreloadInterceptor.RELOAD_GUARD_KEY
        ) === 'true'
    } catch (_) {}

    try {
      this._observability.recordSimpleEvent(
        AppEventName.XsrfMissingAfterPreload,
        {
          error: 'xsrf_missing',
          errorDescription: 'XSRF-TOKEN missing after csrf.json preload',
          browser: this.browserName(),
          reloaded: !alreadyReloaded,
        }
      )
    } catch (_) {}

    if (alreadyReloaded) {
      return
    }

    try {
      this.window.sessionStorage.setItem(
        XsrfPreloadInterceptor.RELOAD_GUARD_KEY,
        'true'
      )
    } catch (_) {}

    try {
      this.window.location.reload()
    } catch (_) {}
  }

  private browserName(): string {
    if (this.platform.FIREFOX) return 'firefox'
    if (this.platform.SAFARI) return 'safari'
    if (this.platform.EDGE) return 'edge'
    if (this.platform.BLINK) return 'blink'
    return 'unknown'
  }

  private hasXsrfCookie(): boolean {
    return !!this._cookie.get('XSRF-TOKEN')
  }
}
