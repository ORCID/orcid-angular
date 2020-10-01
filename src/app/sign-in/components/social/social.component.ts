import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { OauthService } from '../../../core/oauth/oauth.service'
import { environment } from '../../../../environments/environment'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss', './social.component.scss-theme.scss'],
})
export class SocialComponent implements OnInit {
  platform: PlatformInfo
  baseUri: string
  csrf: string
  labelInstitutionalButton = $localize`:@@ngOrcid.signin.institutionalAccount:Access through your institution`
  labelGoogleButton = $localize`:@@ngOrcid.signin.google:Sign in with Google`
  labelFacebookButton = $localize`:@@ngOrcid.signin.facebook:Sign in with Facebook`

  constructor(
    private _signIn: SignInService,
    private _oauth: OauthService,
    private _cookie: CookieService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService
  ) {
    _platform.get().subscribe((data) => {
      this.platform = data
    })
    this.baseUri = environment.API_WEB
    this.csrf = this._cookie.get('XSRF-TOKEN')
  }

  ngOnInit() {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
