import { Component, HostBinding, Inject, LOCALE_ID } from '@angular/core'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'
import { GoogleAnalyticsService } from './core/google-analytics/google-analytics.service'
import { PlatformInfoService } from './cdk/platform-info/platform-info.service'
import { PlatformInfo } from './cdk/platform-info'
import { CookieService } from 'ngx-cookie-service'
import { ZendeskService } from './core/zendesk/zendesk.service'
import { UserService } from './core'
import { first } from 'rxjs/internal/operators/first'
import { mergeMap, switchMap, tap } from 'rxjs/operators'
import { merge } from 'rxjs/internal/observable/merge'
import { HeadlessOnOauthRoutes } from './constants'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  headlessMode = false
  currentRouteIsHeadlessOnOauthPage = true
  screenDirection
  currentRoute
  @HostBinding('class.edge') edge
  @HostBinding('class.ie') ie
  @HostBinding('class.tabletOrHandset') tabletOrHandset
  @HostBinding('class.handset') handset
  @HostBinding('class.tablet') tablet
  @HostBinding('class.desktop') desktop
  @HostBinding('class.columns-8') columns8
  @HostBinding('class.columns-12') columns12
  @HostBinding('class.columns-4') columns4
  platformInfo

  constructor(
    _platformInfo: PlatformInfoService,
    _router: Router,
    _googleAnalytics: GoogleAnalyticsService,
    _zendesk: ZendeskService,
    _userService: UserService
  ) {
    _platformInfo
      .get()
      .pipe(
        tap((platformInfo) => {
          this.platformInfo = platformInfo
          this.currentRouteIsHeadlessOnOauthPage = this.showHeadlessOnOauthPage(
            platformInfo.currentRoute
          )
          // 1- Initial quick check to immediately set headless mode only base on query parameters
          this.setPlatformClasses(platformInfo)
          this.screenDirection = platformInfo.screenDirection
          if (!platformInfo.hasOauthParameters) {
            _zendesk.show()
            _zendesk.adaptPluginToPlatform(platformInfo)
          } else {
            _zendesk.hide()
          }
        }),
        switchMap(() => _userService.getUserSession())
      )
      .subscribe((session) => {
        // 2- Later check to set headless mode based on any existing Oauth session
        this.setPlatformClasses(this.platformInfo, !!session.oauthSession)
        if (session.oauthSession) {
          _zendesk.hide()
        }
      })

    _router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        _googleAnalytics.reportNavigationStart(event.url)
        this.currentRoute = event.url
      }
      if (event instanceof NavigationEnd) {
        _googleAnalytics.reportNavigationEnd(event.url)
        _googleAnalytics.reportPageView(event.urlAfterRedirects)
      }
    })
  }
  showHeadlessOnOauthPage(currentRoute: string): boolean {
    if (currentRoute) {
      const value = HeadlessOnOauthRoutes.filter(
        (url) => currentRoute.indexOf('/' + url) === 0
      )
      return !!value.length
    } else {
      return true
    }
  }

  setPlatformClasses(platformInfo: PlatformInfo, oauthSessionFound?: boolean) {
    this.headlessMode =
      (platformInfo.hasOauthParameters || oauthSessionFound) &&
      this.currentRouteIsHeadlessOnOauthPage
    this.ie = platformInfo.ie
    this.edge = platformInfo.edge
    this.tabletOrHandset = platformInfo.tabletOrHandset
    this.handset = platformInfo.handset
    this.tablet = platformInfo.tablet
    this.desktop = platformInfo.desktop
    this.columns8 = platformInfo.columns8
    this.columns12 = platformInfo.columns12
    this.columns4 = platformInfo.columns4
  }
}
