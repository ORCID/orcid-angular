import { Component, OnInit, Inject, HostBinding } from '@angular/core'
import { WINDOW } from '../../core/window/window.service'
import { CookieService } from 'ngx-cookie-service'

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
