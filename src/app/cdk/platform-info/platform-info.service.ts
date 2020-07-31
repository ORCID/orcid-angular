import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Platform } from '@angular/cdk/platform'
import { Injectable, LOCALE_ID, Inject } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { PlatformInfo } from './platform-info.type'
import { BROWSERLIST_REGEXP } from './browserlist.regexp'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { tap, filter } from 'rxjs/operators'
import { WINDOW } from '../window'
import { environment } from 'src/environments/environment'
import { ApplicationRoutes } from 'src/app/constants'

@Injectable()
export class PlatformInfoService {
  previouslyHadQueryParameters = false
  platform: PlatformInfo = {
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
    // Dirty fix to quickly get the startup OAuth mode:
    // Normally it would be preferred read GET parameters from the ActivatedRoute
    // but the observable return by it takes a while to respond, and this can make the application blink on startup
    // this is the reason why a quick indexOf is run on the window object to quickly check if the app should start on Oauth mode
    oauthMode: this.window.location.href.toLowerCase().indexOf('oauth') >= 0,
    social: this.window.location.href.toLowerCase().indexOf('social') >= 0,
    institutional:
      this.window.location.href.toLowerCase().indexOf('institutional') >= 0,
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
        const previousOauthState = this.updateOauthState(queryParameters)
        const previousSocialState = this.updateSocialState(queryParameters)
        const previousInstitutionalState = this.updatesInstitutionalState(
          queryParameters
        )
        if (
          this.platform.oauthMode !== previousOauthState ||
          this.platform.social !== previousSocialState ||
          this.platform.institutional !== previousInstitutionalState
        ) {
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
   * Based on the query check if the current state is in Oauth mode
   */
  private updateOauthState(queryParameters: Params) {
    const previousOauthState = this.platform.oauthMode
    this.platform.queryParameters = queryParameters
    if (
      queryParameters.hasOwnProperty('oauth') ||
      queryParameters.hasOwnProperty('Oauth') ||
      queryParameters.hasOwnProperty('client_id')
    ) {
      this.platform.oauthMode = true
    } else {
      this.platform.oauthMode = false
    }
    return previousOauthState
  }

  /**
   * Based on the query and the current router check if the platform should be handle as social linking state
   */
  private updateSocialState(queryParameters: Params) {
    const previousSocialState = this.platform.social

    if (
      (queryParameters.hasOwnProperty('providerId') &&
        (queryParameters['providerId'] === 'facebook' ||
          queryParameters['providerId'] === 'google')) ||
      this._router.url.indexOf(ApplicationRoutes.social) >= 0
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
    return this.platformSubject.asObservable()
  }
}
