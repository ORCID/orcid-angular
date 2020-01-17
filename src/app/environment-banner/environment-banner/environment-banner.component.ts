import { Component, OnInit, Inject, HostBinding } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss'],
  preserveWhitespaces: true,
})
export class EnvironmentBannerComponent implements OnInit {
  hostUrl
  @HostBinding('style.display') display = 'none'
  constructor(
    @Inject(WINDOW) private window: Window,
    private _cs: CookieService
  ) {
    this.hostUrl = window.location.host
    if (!this._cs.get('testWarningCookie')) {
      this.display = 'auto'
    }
  }

  onDismiss() {
    this.display = 'none'
    this._cs.set('testWarningCookie', 'dont show message', 365)
  }

  ngOnInit() {}
}
