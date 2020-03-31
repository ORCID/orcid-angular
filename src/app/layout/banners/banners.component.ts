import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { take } from 'rxjs/operators'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  preserveWhitespaces: true,
})
export class BannersComponent implements OnInit {
  maintenanceMessages
  showCookieBanner
  showUnsupportedBrowserBanner
  closableElementAtDisplay
  constructor(
    private _cookie: CookieService,
    _platformInfo: PlatformInfoService,
    togglz: TogglzService
  ) {
    togglz.getMaintenanceMessages().subscribe(value => {
      this.maintenanceMessages = value
      this.updateClosableMessage()
    })

    _platformInfo
      .get()
      .pipe(take(1))
      .subscribe(
        platform =>
          (this.showUnsupportedBrowserBanner = platform.unsupportedBrowser)
      )
    this.showCookieBanner = !_cookie.check('orcidCookiePolicyAlert')
  }

  updateClosableMessage() {
    if (this.maintenanceMessages && this.maintenanceMessages.closableElements) {
      this.maintenanceMessages.closableElements.forEach(node => {
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
