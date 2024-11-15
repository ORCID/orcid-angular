import { Component, OnInit, Inject, HostBinding } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { WINDOW } from 'src/app/cdk/window'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss'],
  preserveWhitespaces: true,
})
export class EnvironmentBannerComponent implements OnInit {
  hostUrl
  canDismiss = environment['CAN_DISABLE_TEST_WARNING_BANNER']
  @HostBinding('style.display') display = 'none'
  labelWarning = $localize`:@@environmentBanner.ariaLabelWarning:Warning, testing website`
  notInsideIframe: boolean
  constructor(
    @Inject(WINDOW) private window: Window,
    private _cookieService: CookieService
  ) {
    this.notInsideIframe = window.self === window.top
    this.hostUrl = window.location.host
    if (
      (!this._cookieService.get('testWarningCookie') || !this.canDismiss) &&
      this.notInsideIframe
    ) {
      this.display = 'auto'
    }
  }

  onDismiss() {
    this.display = 'none'
    this._cookieService.set('testWarningCookie', 'dont show message', 365)
  }

  ngOnInit() {}
}
