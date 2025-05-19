import { Component, HostBinding, HostListener, Inject } from '@angular/core'
import { NavigationEnd, NavigationStart, Router } from '@angular/router'
import { catchError, tap } from 'rxjs/operators'
import {
  finishPerformanceMeasurement,
  reportNavigationStart,
} from './analytics-utils'
import { PlatformInfo } from './cdk/platform-info'
import { PlatformInfoService } from './cdk/platform-info/platform-info.service'
import { WINDOW } from './cdk/window'
import { ApplicationRoutes, HeadlessOnOauthRoutes } from './constants'
import { UserService } from './core'
import { ErrorHandlerService } from './core/error-handler/error-handler.service'
import { GoogleTagManagerService } from './core/google-tag-manager/google-tag-manager.service'
import { TitleService } from './core/title-service/title.service'
import { ZendeskService } from './core/zendesk/zendesk.service'
import { ERROR_REPORT } from './errors'
import { TogglzService } from './core/togglz/togglz.service'
import { NewRelicService } from './core/new-relic/new-relic.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentlyDisplayingZendesk = true
  headlessMode = false
  footerlessMode = false
  spacing: boolean
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
    _googleTagManagerService: GoogleTagManagerService,
    _zendesk: ZendeskService,
    private _userService: UserService,
    private _errorHandler: ErrorHandlerService,
    @Inject(WINDOW) private _window: Window,
    _titleService: TitleService,
    _togglzService: TogglzService,
    _newRelicService: NewRelicService
  ) {
    _titleService.init()
    _platformInfo
      .get()
      .pipe(
        tap((platformInfo) => {
          this.platformInfo = platformInfo
          this.currentRouteIsHeadlessOnOauthPage = this.showHeadlessOnOauthPage(
            platformInfo.currentRoute
          )
          this.setPlatformClasses(platformInfo)
          this.screenDirection = platformInfo.screenDirection
          if (
            !platformInfo.hasOauthParameters &&
            !this.currentlyDisplayingZendesk
          ) {
            _zendesk.show()
            _zendesk.adaptPluginToPlatform(platformInfo)
            this.currentlyDisplayingZendesk = true
          } else if (
            platformInfo.hasOauthParameters &&
            this.currentlyDisplayingZendesk
          ) {
            _zendesk.hide()

            this.currentlyDisplayingZendesk = false
          }
        })
      )
      .subscribe()

    _togglzService
      .getStateOf('NEW_RELIC_BROWSER_MONITORING')
      .subscribe((NEW_RELIC_BROWSER_MONITORING) => {
        if (NEW_RELIC_BROWSER_MONITORING) {
          _newRelicService.init()
        }
      })

    _router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        reportNavigationStart(event.url)
        this.currentRoute = event.url
      }
      if (event instanceof NavigationEnd) {
        const duration = finishPerformanceMeasurement(event.url)
        _googleTagManagerService
          .addGtmToDom()
          .pipe(
            catchError((err) =>
              this._errorHandler.handleError(
                err,
                ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
              )
            )
          )
          .subscribe((response) => {
            if (response) {
              _googleTagManagerService
                .reportNavigationEnd(event.url, duration)
                .subscribe(() => {
                  _googleTagManagerService.reportPageView(
                    event.urlAfterRedirects
                  )
                })
            }
          })
        this.addSpacing()
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
    const isOauth =
      (platformInfo.hasOauthParameters || oauthSessionFound) &&
      this.currentRouteIsHeadlessOnOauthPage
    this.headlessMode = isOauth || platformInfo.summaryScreen
    this.footerlessMode = platformInfo.summaryScreen
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

  @HostListener('window:visibilitychange')
  onVisibilityChange(value) {
    this._userService.setTimerAsHiddenState(this._window.document.hidden)
  }

  private addSpacing() {
    let route = this.currentRoute.split('?')[0]
    route = route.substring(1)

    switch (route) {
      case ApplicationRoutes.signin:
      case ApplicationRoutes.register:
      case ApplicationRoutes.authorize:
      case ApplicationRoutes.search:
        this.spacing = true
        break
      default:
        this.spacing = false
        break
    }
  }
}
