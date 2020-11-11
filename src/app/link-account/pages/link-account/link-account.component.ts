import { Component, OnInit } from '@angular/core'

import { PlatformInfoService } from '../../../cdk/platform-info'
import { DiscoService } from '../../../core/disco/disco.service'
import { OauthService } from '../../../core/oauth/oauth.service'
import { Institutional } from '../../../types/institutional.endpoint'
import { SignInData } from '../../../types/sign-in-data.endpoint'
import { Router } from '@angular/router'
import { ApplicationRoutes } from 'src/app/constants'
import { first } from 'rxjs/operators'

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
    private _disco: DiscoService,
    private _oauthService: OauthService,
    private _router: Router
  ) {
    _platformInfo.get().subscribe((platform) => {
      if (platform.social) {
        this.loadSocialSignInData()
      } else if (platform.institutional) {
        this.loadShibbolethSignInData()
      }
    })
  }

  ngOnInit(): void {}

  loadShibbolethSignInData() {
    this._oauthService.loadShibbolethSignInData().subscribe((data) => {
      this.signInData = data
      this.getInstitution(this.signInData.providerId)
    })
  }

  getInstitution(entityId) {
    this._disco.getInstitutionBaseOnID(entityId).subscribe((institution) => {
      this.loading = false
      this.entityDisplayName = institution.DisplayNames.filter(
        (subElement) => subElement.lang === 'en'
      ).map((en) => {
        return en.value
      })[0]
    })
  }

  loadSocialSignInData() {
    this._oauthService.loadSocialSigninData().subscribe((data) => {
      this.signInData = data
      this.entityDisplayName = data.providerId
      if (
        this.entityDisplayName === 'facebook' ||
        this.entityDisplayName === 'google'
      ) {
        this.entityDisplayName =
          this.entityDisplayName.charAt(0).toUpperCase() +
          this.entityDisplayName.slice(1)
      }
      this.loading = false
    })
  }

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

            // TODO leomendoza123
            // Adding the social/institutional parameters on the URL causes issues
            // https://trello.com/c/EiZOE6b1/7138

            email: null,
            firstName: null,
            lastName: null,
            linkType: null,
            providerId: null,
          },
        })
      })
  }
}
