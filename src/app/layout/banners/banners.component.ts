import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  preserveWhitespaces: true,
})
export class BannersComponent implements OnInit {
  showCookieBanner
  showUnsupportedBrowserBanner
  constructor(_cookie: CookieService, _platformInfo: PlatformInfoService) {
    _platformInfo
      .get()
      .pipe(take(1))
      .subscribe(
        platform =>
          (this.showUnsupportedBrowserBanner = platform.unsupportedBrowser)
      )
    this.showCookieBanner = !_cookie.check('orcidCookiePolicyAlert')
  }

  ngOnInit() {}
}
