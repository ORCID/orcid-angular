import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Platform } from '@angular/cdk/platform'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { ApplicationRoutes } from 'src/app/constants'

import { WINDOW } from '../window'
import { BROWSERLIST_REGEXP } from './browserlist.regexp'
import { PlatformInfo } from './platform-info.type'

@Injectable()
export class PlatformInfoService {
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
    queryParameters: this.getQueryParams(),
    screenDirection: 'ltr',
    hasOauthParameters: false,
    social: false,
    institutional: false,
    currentRoute: '',
    reactivation: false,
    reactivationCode: '',
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

    if (!BROWSERLIST_REGEXP.test(navigator.userAgent)) {
      this.platform.unsupportedBrowser = true
    }

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
      .subscribe((queryParameters) => {
        this.previouslyHadQueryParameters = true
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

  /**
   * @deprecated Based on the query check if the current state is in Oauth mode
   */
  private updateOauthState(queryParameters: Params) {
    const previousOauthState = this.platform.hasOauthParameters
    this.platform.queryParameters = queryParameters
    if (
      queryParameters.hasOwnProperty('oauth') ||
      queryParameters.hasOwnProperty('Oauth') ||
      queryParameters.hasOwnProperty('client_id')
    ) {
      this.platform.hasOauthParameters = true
    } else {
      this.platform.hasOauthParameters = false
    }
    return previousOauthState
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
    new URLSearchParams(this.window.location.search).forEach(
      (value, key) => (params[key] = value)
    )
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
