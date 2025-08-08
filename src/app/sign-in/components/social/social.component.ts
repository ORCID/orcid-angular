import { Component, Inject, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { first } from 'rxjs/operators'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
@Component({
    selector: 'app-social',
    templateUrl: './social.component.html',
    styleUrls: ['./social.component.scss', './social.component.scss-theme.scss'],
    standalone: false
})
export class SocialComponent implements OnInit {
  platform: PlatformInfo
  baseUri: string
  csrf: string
  labelInstitutionalButton = $localize`:@@ngOrcid.signin.institutionalAccount:Access through your institution`
  labelGoogleButton = $localize`:@@ngOrcid.signin.google:Sign in with Google`
  labelFacebookButton = $localize`:@@ngOrcid.signin.facebook:Sign in with Facebook`

  constructor(
    private _platformInfo: PlatformInfoService,
    private _router: Router,
    @Inject(WINDOW) private window: Window,
    private _cookie: CookieService,
    _platform: PlatformInfoService
  ) {
    _platform.get().subscribe((data) => {
      this.platform = data
    })
    this.baseUri = runtimeEnvironment.API_WEB
    this.csrf = this._cookie.get('XSRF-TOKEN')
  }

  accessThroughInstitution() {
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._router.navigate(['/institutional-signin'], {
          queryParams: platform.queryParameters,
        })
      })
  }

  ngOnInit() {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
