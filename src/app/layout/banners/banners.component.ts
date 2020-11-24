import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { take, filter } from 'rxjs/operators'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { MaintenanceMessage } from 'src/app/types/togglz.local'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  preserveWhitespaces: true,
})
export class BannersComponent implements OnInit {
  environment = environment
  maintenanceMessages: MaintenanceMessage
  showCookieBanner
  showUnsupportedBrowserBanner
  closableElementAtDisplay
  ariaLabelCookiesPolicy = $localize`:@@layout.ariaLabelCookies:Cookies Policy`

  constructor(
    private _cookie: CookieService,
    _platformInfo: PlatformInfoService,
    togglz: TogglzService
  ) {
    // All closable maintenance messages are displayed as banners
    togglz.getMaintenanceMessages().subscribe((value) => {
      this.maintenanceMessages = value
      this.updateClosableMessage()
    })

    // Show unsupported browser banner
    _platformInfo
      .get()
      .pipe(
        filter((platform) => platform.unsupportedBrowser),
        take(1)
      )
      .subscribe(
        (platform) =>
          (this.showUnsupportedBrowserBanner = platform.unsupportedBrowser)
      )

    // Show cookie banner
    this.showCookieBanner = !_cookie.check('orcidCookiePolicyAlert')
  }

  updateClosableMessage() {
    if (this.maintenanceMessages && this.maintenanceMessages.closableElements) {
      this.maintenanceMessages.closableElements.forEach((node) => {
        if (
          node &&
          node.id &&
          !this._cookie.check(node.id) &&
          !this.closableElementAtDisplay
        ) {
          this.closableElementAtDisplay = node
        }
      })
    }
  }

  understoodClosableMessage(element: Element) {
    this.closableElementAtDisplay = null
    this._cookie.set(element.id, 'understood', 365)
    this.updateClosableMessage()
  }

  ngOnInit() {}
}
