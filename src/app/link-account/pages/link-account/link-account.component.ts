import { Component, OnInit } from '@angular/core'

import { PlatformInfoService } from '../../../cdk/platform-info'
import { DiscoService } from '../../../core/disco/disco.service'
import { OauthService } from '../../../core/oauth/oauth.service'
import { Institutional } from '../../../types/institutional.endpoint'
import { SignInData } from '../../../types/sign-in-data.endpoint'

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
    _platformInfo: PlatformInfoService,
    private _disco: DiscoService,
    private _oauthService: OauthService
  ) {
    _platformInfo.get().subscribe((platform) => {
      if (platform.social) {
        this.loadSocialSignInData()
      } else {
        this.loadShibbolethSignInData()
      }
    })
  }

  ngOnInit(): void {}

  loadShibbolethSignInData() {
    this._oauthService.loadShibbolethSignInData().subscribe(
      (data) => {
        this.signInData = data
        this.getInstitution(this.signInData.providerId)
      },
      (error) => {
        // TODO @leomendoza123 display error using a toaster
        console.error('Error getting disco feed' + JSON.stringify(error))
      }
    )
  }

  getInstitution(entityId) {
    this._disco.getInstitutionBaseOnID(entityId).subscribe(
      (institution) => {
        this.loading = false
        this.entityDisplayName = institution.DisplayNames.filter(
          (subElement) => subElement.lang === 'en'
        ).map((en) => {
          return en.value
        })[0]
      },
      (error) => {
        // TODO @leomendoza123 display error using a toaster
        console.error('Error getting disco feed' + JSON.stringify(error))
      }
    )
  }

  loadSocialSignInData() {
    this._oauthService.loadSocialSigninData().subscribe(
      (data) => {
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
      },
      (error) => {
        // TODO @leomendoza123 display error using a toaster
        console.error('Error getting disco feed' + JSON.stringify(error))
      }
    )
  }

  show2FAEmitter($event) {
    this.show2FA = true
  }
}
