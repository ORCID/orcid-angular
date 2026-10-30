import { DOCUMENT } from '@angular/common'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

export type ConsentVendor = 'onetrust' | 'cookieyes'

/** The categories CookieYes reports in getCkyConsent().categories. */
export const COOKIE_YES_CATEGORIES = [
  'necessary',
  'functional',
  'analytics',
  'performance',
  'advertisement',
] as const

export type CookieYesCategory = (typeof COOKIE_YES_CATEGORIES)[number]

/**
 * One first-party cookie per category, set while that category is consented
 * and removed when it is not, so every CookieYes category has a cookie to test
 * against (OPS-2428 proof of concept only).
 */
export const COOKIE_YES_TEST_COOKIE_PREFIX = 'orcid-cookieyes-test-'

const COOKIE_YES_CONSENT_EVENTS = [
  'cookieyes_banner_load',
  'cookieyes_consent_update',
]
const TEST_COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60

interface CookieYesWindow extends Window {
  orcidConsent?: { vendor?: ConsentVendor }
  runtimeEnvironment?: { COOKIE_YES?: string }
  getCkyConsent?: () => { categories?: Partial<Record<string, boolean>> }
  revisitCkyConsent?: () => void
}

/**
 * Which consent manager scripts/onetrust.runtime.js loaded on this page, and
 * the CookieYes behaviour the app adds on top of it. While OneTrust is the
 * vendor the only thing it does is remove test cookies a CookieYes visit left,
 * and only where CookieYes could have run, so production is untouched.
 */
@Injectable({
  providedIn: 'root',
})
export class ConsentVendorService implements OnDestroy {
  private _window = inject(WINDOW) as CookieYesWindow
  private _document = inject(DOCUMENT)
  private _consentListener?: () => void

  get vendor(): ConsentVendor {
    return this._window.orcidConsent?.vendor === 'cookieyes'
      ? 'cookieyes'
      : 'onetrust'
  }

  isCookieYes(): boolean {
    return this.vendor === 'cookieyes'
  }

  init(): void {
    if (!this.isCookieYes()) {
      // A browser that opted out keeps no test cookies from its CookieYes visit.
      // Only where CookieYes could have run, so production never writes here.
      if (this._window.runtimeEnvironment?.COOKIE_YES) {
        this._clearTestCookies()
      }
      return
    }
    if (this._consentListener) {
      return
    }
    this._consentListener = () => this._syncTestCookies()
    for (const event of COOKIE_YES_CONSENT_EVENTS) {
      this._document.addEventListener(event, this._consentListener)
    }
    // The banner may have loaded before the app bootstrapped.
    this._syncTestCookies()
  }

  ngOnDestroy(): void {
    if (this._consentListener) {
      for (const event of COOKIE_YES_CONSENT_EVENTS) {
        this._document.removeEventListener(event, this._consentListener)
      }
      this._consentListener = undefined
    }
  }

  /**
   * Opens the CookieYes preference centre. OneTrust binds its own footer link
   * by class, so this does nothing while OneTrust is the vendor, not even to
   * the event.
   *
   * The trigger's default is prevented because the preference centre takes
   * focus as it opens: the keypress that follows an Enter keydown would land on
   * its first control and activate it, closing the dialog it just opened.
   */
  openPreferences(trigger?: Event): void {
    if (!this.isCookieYes()) {
      return
    }
    if ((trigger as KeyboardEvent | undefined)?.repeat) {
      trigger.preventDefault()
      return
    }
    trigger?.preventDefault()
    this._window.revisitCkyConsent?.()
  }

  private _syncTestCookies(): void {
    const categories = this._window.getCkyConsent?.()?.categories
    if (!categories) {
      return
    }
    for (const category of COOKIE_YES_CATEGORIES) {
      this._writeTestCookie(category, !!categories[category])
    }
  }

  private _clearTestCookies(): void {
    if (!this._document.cookie.includes(COOKIE_YES_TEST_COOKIE_PREFIX)) {
      return
    }
    for (const category of COOKIE_YES_CATEGORIES) {
      this._writeTestCookie(category, false)
    }
  }

  private _writeTestCookie(category: CookieYesCategory, granted: boolean) {
    const secure =
      this._window.location?.protocol === 'https:' ? '; Secure' : ''
    const maxAge = granted ? TEST_COOKIE_MAX_AGE_SECONDS : 0
    this._document.cookie =
      `${COOKIE_YES_TEST_COOKIE_PREFIX}${category}=granted; path=/; ` +
      `max-age=${maxAge}; SameSite=Lax${secure}`
  }
}
