import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  preserveWhitespaces: true,
})
export class CookieBannerComponent implements OnInit {
  @Output() dismiss = new EventEmitter()

  constructor(private _cookie: CookieService) {}

  ngOnInit() {}

  onDismiss() {
    this._cookie.set('orcidCookiePolicyAlert', 'dont show message', 365)
    this.dismiss.emit()
  }
}
