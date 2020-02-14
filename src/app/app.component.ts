import { Component, HostBinding, Inject, LOCALE_ID } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { GoogleAnalyticsService } from './core/google-analytics/google-analytics.service'
import { PlatformInfoService } from './cdk/platform-info/platform-info.service'
import { PlatformInfo } from './cdk/platform-info'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  direction
  @HostBinding('class.edge') edge
  @HostBinding('class.ie') ie
  @HostBinding('class.tabletOrHandset') tabletOrHandset
  @HostBinding('class.handset') handset
  @HostBinding('class.tablet') tablet
  @HostBinding('class.desktop') desktop
  @HostBinding('class.columns-8') columns8
  @HostBinding('class.columns-12') columns12
  @HostBinding('class.columns-4') columns4

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(LOCALE_ID) public locale: string,
    _router: Router,
    _googleAnalytics: GoogleAnalyticsService
  ) {
    _platformInfo.get().subscribe(platformInfo => {
      this.setPlatformClasses(platformInfo)
    })
    this.direction = locale === 'ar' ? 'rtl' : null

    _router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        _googleAnalytics.reportPageView(event.urlAfterRedirects)
      }
    })
  }

  setPlatformClasses(platformInfo: PlatformInfo) {
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
