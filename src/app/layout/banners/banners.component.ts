import { Component, OnInit } from '@angular/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { take, filter } from 'rxjs/operators'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { MaintenanceMessage } from 'src/app/types/togglz.local'

import { CookieService } from 'ngx-cookie-service'

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.scss'],
    preserveWhitespaces: true,
    standalone: false
})
export class BannersComponent implements OnInit {
  environment = runtimeEnvironment
  maintenanceMessages: MaintenanceMessage
  showUnsupportedBrowserBanner
  closableElementAtDisplay
  ariaLabelCookiesPolicy = $localize`:@@layout.ariaLabelCookies:Cookies Policy`

  constructor(
    _platformInfo: PlatformInfoService,
    togglz: TogglzService,
    private _cookie: CookieService
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
