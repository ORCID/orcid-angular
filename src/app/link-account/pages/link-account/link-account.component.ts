import { Component, OnInit } from '@angular/core'

import { PlatformInfoService } from '../../../cdk/platform-info'
import { DiscoService } from '../../../core/disco/disco.service'
import { OauthService } from '../../../core/oauth/oauth.service'
import { Institutional } from '../../../types/institutional.endpoint'
import { SignInData } from '../../../types/sign-in-data.endpoint'
import { Router } from '@angular/router'
import { ApplicationRoutes } from 'src/app/constants'
import { first } from 'rxjs/operators'
import { UserService } from 'src/app/core'

@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: [
    './link-account.component.scss',
    './link-account.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class LinkAccountComponent implements OnInit {
  show2FA = false
  signInData: SignInData
  institution: Institutional
  entityDisplayName: string
  loading = true
  signingLoading = false
  email = ''

  constructor(
    private _platformInfo: PlatformInfoService,
    private _user: UserService,
    private _disco: DiscoService,
    private _oauthService: OauthService,
    private _router: Router
  ) {
    this._user
      .getUserSession()
      .pipe(first())
      .subscribe((session) => {
        this.signInData = session.thirdPartyAuthData.signinData
        this.entityDisplayName = session.thirdPartyAuthData.entityDisplayName
        this.loading = false
      })
  }

  ngOnInit(): void {}

  show2FAEmitter($event) {
    this.show2FA = true
  }

  cancel() {
    this._platformInfo.remove()
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._router.navigate([ApplicationRoutes.signin], {
          queryParams: {
            ...platform.queryParameters,
            // The parameters added after a linking + register process are remove

            /// TODO @leomendoza123 depend only on the user session thirty party login data
            /// avoid taking data from the the parameters.

            linkType: null,
            providerId: null,
          },
        })
      })
  }
}
