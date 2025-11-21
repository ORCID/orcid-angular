import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Platform } from '@angular/cdk/platform'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import Bowser from 'bowser'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { ApplicationRoutes } from 'src/app/constants'

import { WINDOW } from '../window'
import supportedBrowsersJson from './supported-browsers.json'
import { PlatformInfo } from './platform-info.type'

@Injectable({
  providedIn: 'root',
})
export class PlatformInfoService {
  private readonly supportedBrowsers: Record<string, { major: number; minor: number }> =
    (supportedBrowsersJson as unknown) as Record<
      string,
      { major: number; minor: number }
    >
  previouslyHadQueryParameters = false
  private platform: PlatformInfo = {
    unsupportedBrowser: false,
    desktop: false,
    tabletOrHandset: false,
    tablet: false,
    handset: false,
    edge: false,
    ie: false,
    firefox: false,
    safary: false,
    columns4: false,
    columns8: false,
    columns12: false,
    rtl: false,
    ltr: true,
    queryParameters: {},
    screenDirection: 'ltr',
    hasOauthParameters: false,
    social: false,
    institutional: false,
    currentRoute: '',
    reactivation: false,
    reactivationCode: '',
    summaryScreen: false,
  }
  platformSubject = new BehaviorSubject<PlatformInfo>(this.platform)

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private _breakpointObserver: BreakpointObserver,
    _route: ActivatedRoute,
    private _router: Router,
    _platform: Platform,
    @Inject(WINDOW) private window: Window
  ) {
    this.platform.rtl = locale === 'ar' ? true : false
    this.platform.ltr = !this.platform.rtl
    this.platform.screenDirection = this.platform.rtl ? 'rtl' : 'ltr'
    this.platform.queryParameters = this.getQueryParams()

    this.platform.unsupportedBrowser = this.isUnsupportedBrowser(
      this.window.navigator.userAgent
    )

    this.platform.firefox = _platform.FIREFOX
    this.platform.safary = _platform.SAFARI
    this.platform.ie = _platform.TRIDENT
    this.platform.edge = _platform.EDGE
    this.platformSubject.next(this.platform)

    _route.queryParams
      .pipe(
        filter(
          (value) =>
            // The first ActivatedRoute queryParams value always an empty object (no matter if it has query parameters)
            // because of the issue https://github.com/angular/angular/issues/12157
            // this filter is a the current fix for that
            Object.keys(value).length > 0 || this.previouslyHadQueryParameters
        )
      )
      .subscribe(() => {
        this.previouslyHadQueryParameters = true
        const queryParameters = this.getQueryParams()
        this.platform.queryParameters = queryParameters
        const previousOauthState = this.hasOauthParameters()
        const previousSocialState = this.updateSocialState(queryParameters)
        const previousInstitutionalState =
          this.updatesInstitutionalState(queryParameters)
        if (
          this.platform.hasOauthParameters !== previousOauthState ||
          this.platform.social !== previousSocialState ||
          this.platform.institutional !== previousInstitutionalState
        ) {
          this.platformSubject.next(this.platform)
        }
      })

    _router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.platform.currentRoute = event.url
        this.platformSubject.next(this.platform)
      }
    })

    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state) => {
        if (state.matches) {
          this.platform.handset = true
        } else {
          this.platform.handset = false
        }
        this.platformSubject.next(this.platform)
      })
    this._breakpointObserver
      .observe([Breakpoints.Tablet])
      .subscribe((state) => {
        if (state.matches) {
          this.platform.tablet = true
        } else {
          this.platform.tablet = false
        }
        this.platformSubject.next(this.platform)
      })
    this._breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((state) => {
        if (state.matches) {
          this.platform.tabletOrHandset = true
          this.platform.desktop = false
        } else {
          this.platform.tabletOrHandset = false
          this.platform.desktop = true
        }
        this.platformSubject.next(this.platform)
      })

    this._breakpointObserver
      .observe(['(min-width: 839.99px)', '(min-width: 599.99px)'])
      .subscribe((state) => {
        if (state.breakpoints['(min-width: 839.99px)']) {
          this.platform.columns8 = false
          this.platform.columns12 = true
          this.platform.columns4 = false
        } else if (state.breakpoints['(min-width: 599.99px)']) {
          this.platform.columns8 = true
          this.platform.columns12 = false
          this.platform.columns4 = false
        } else {
          this.platform.columns8 = false
          this.platform.columns12 = false
          this.platform.columns4 = true
        }
        this.platformSubject.next(this.platform)
      })
  }

  private getBrowserKeyFromName(name: string | undefined): string | null {
    if (!name) {
      return null
    }

    const lowered = name.toLowerCase()

    if (lowered.includes('edge')) {
      return 'edge'
    }
    if (lowered.includes('firefox')) {
      return 'firefox'
    }
    if (lowered.includes('opera') || lowered.includes('opr')) {
      return 'opera'
    }
    if (lowered.includes('samsung')) {
      return 'samsung'
    }
    if (lowered.includes('chrome') && !lowered.includes('edge')) {
      // Treat Chrome and Chromium (desktop + Android) as "chrome"
      return 'chrome'
    }
    if (lowered.includes('safari') && !lowered.includes('chrome')) {
      // Desktop + iOS Safari
      return 'safari'
    }
    if (lowered.includes('trident') || lowered.includes('msie')) {
      return 'ie'
    }

    return null
  }

  private isUnsupportedBrowser(userAgent: string): boolean {
    try {
      const parser = Bowser.getParser(userAgent)
      const browser = parser.getBrowser()
      const browserKey = this.getBrowserKeyFromName(browser.name)

      if (!browserKey) {
        // If we cannot determine the browser family, treat it as unsupported
        return true
      }

      const minSupportedVersion = this.supportedBrowsers[browserKey]
      if (!minSupportedVersion) {
        // If we have no data for this browser family, treat it as unsupported
        return true
      }

      const version = browser.version || ''
      const [majorPart, minorPart = '0'] = version.split('.')
      const major = parseInt(majorPart || '', 10)
      const minor = parseInt(minorPart || '0', 10)

      if (Number.isNaN(major)) {
        return true
      }

      const minMajor = minSupportedVersion.major
      const minMinor = minSupportedVersion.minor ?? 0

      if (major > minMajor) {
        return false
      }
      if (major < minMajor) {
        return true
      }

      // Same major, compare minor versions
      const safeMinor = Number.isNaN(minor) ? 0 : minor
      return safeMinor < minMinor
    } catch {
      // On any parsing error, fall back to unsupported to be safe
      return true
    }
  }

  /**
   * Based on the query and the current router check if the platform should be handle as social linking state
   */
  private updateSocialState(queryParameters: Params) {
    const previousSocialState = this.platform.social

    /// TODO @leomendoza123 depend only on the user session thirty party login data
    /// avoid taking data from the the parameters.

    if (
      (queryParameters.hasOwnProperty('providerId') &&
        (queryParameters['providerId'] === 'facebook' ||
          queryParameters['providerId'] === 'google')) ||
      this.window.location.pathname
        .toLowerCase()
        .indexOf(ApplicationRoutes.social) >= 0
    ) {
      this.platform.social = true
    } else {
      this.platform.social = false
    }
    return previousSocialState
  }

  /**
   * Based on the query and the current router check if the platform should be handle as institutional linking state
   */
  private updatesInstitutionalState(queryParameters: Params) {
    const previousInstitutionalState = this.platform.social

    if (
      (queryParameters.hasOwnProperty('providerId') &&
        queryParameters['providerId'] &&
        queryParameters['providerId'] !== 'facebook' &&
        queryParameters['providerId'] !== 'google') ||
      this._router.url.indexOf(ApplicationRoutes.institutional) >= 0
    ) {
      this.platform.institutional = true
    } else {
      this.platform.institutional = false
    }
    return previousInstitutionalState
  }

  public get(): Observable<PlatformInfo> {
    // Dirty fix to quickly get the startup OAuth mode:
    // Normally it would be preferred read GET parameters from the ActivatedRoute
    // but the observable return by it takes a while to respond, and this can make the application blink on startup
    // this is the reason why a quick indexOf is run on the window object to quickly check if the app should start on Oauth mode
    this.platform = {
      ...this.platform,
      hasOauthParameters: this.hasOauthParameters(),
      social:
        this.window.location.pathname.toLowerCase().indexOf('social-linking') >=
        0,
      institutional:
        this.window.location.pathname
          .toLowerCase()
          .indexOf('institutional-linking') >= 0 ||
        this.window.location.pathname
          .toLowerCase()
          .indexOf('institutional-signin') >= 0,
      reactivation:
        this.window.location.pathname.toLowerCase().indexOf('reactivation') >=
        0,
      reactivationCode: this.getReactivationCode(),
      summaryScreen: this.window.location.pathname.endsWith('/summary'),
    }
    this.platformSubject.next(this.platform)
    return this.platformSubject.asObservable()
  }

  public remove(): void {
    this.platform.social = false
    this.platform.institutional = false
    this.platformSubject.next(this.platform)
  }

  public hasOauthParameters() {
    const params = this.platform.queryParameters
    if (
      Object.keys(params).length &&
      (params.hasOwnProperty('client_id') ||
        params.hasOwnProperty('redirect_uri') ||
        params.hasOwnProperty('response_type'))
    ) {
      return true
    }
    return false
  }

  public getQueryParams(): Params {
    const params: Params = {}
    const search = this.window.location.search || ''
    const query = search.startsWith('?') ? search.substring(1) : search
    if (!query) return params
    for (const part of query.split('&')) {
      if (!part) continue
      const [rawKey, rawValue = ''] = part.split('=')
      if (!rawKey) continue
      const key = decodeURIComponent(rawKey)
      const value = decodeURIComponent(rawValue)
      params[key] = value
    }
    return params
  }

  public getCurrentRoute(): string {
    return this._router.url
  }

  getReactivationCode(): string {
    const segments = window.location.href.split('/')
    return segments[segments.length - 1]
  }
}
