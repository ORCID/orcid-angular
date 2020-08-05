import { Component, OnInit } from '@angular/core'
import { DiscoService } from '../../../core/disco/disco.service'
import { OauthService } from '../../../core/oauth/oauth.service'
import { SignInData } from '../../../types/sign-in-data.endpoint'
import { Institutional } from '../../../types/institutional.endpoint'
import { PlatformInfoService } from '../../../cdk/platform-info'

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
  loading = false
  show2FA = false
  signInData: SignInData
  institution: Institutional
  entityId: string
  loadedFeed = false
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
    this._oauthService
      .loadShibbolethSignInData()
      .pipe()
      .subscribe(
        (data) => {
          this.signInData = data
          // this.getInstitution(this.signInData.providerId)
        },
        (error) => {
          // TODO @leomendoza123 display error using a toaster
          console.error('Error getting disco feed' + JSON.stringify(error))
        }
      )
  }

  // getInstitution(entityId) {
  //   this._disco
  //     .getDiscoFeed()
  //     .subscribe(
  //       (institutions) => {
  //         this.entityId = institutions
  //           .filter((institution) => institution.entityID === entityId)
  //           .map((result) => {
  //             return result.DisplayNames.filter(
  //               (subElement) => subElement.lang === 'en'
  //             ).map((en) => {
  //               return en.value
  //             })
  //           })[0]
  //           .toString()
  //         this.loadedFeed = true
  //       },
  //       (error) => {
  //         // TODO @leomendoza123 display error using a toaster
  //         console.error('Error getting disco feed' + JSON.stringify(error))
  //       }
  //     )
  // }

  loadSocialSignInData() {
    this._oauthService
      .loadSocialSigninData()
      .pipe()
      .subscribe(
        (data) => {
          this.signInData = data
          this.entityId = data.providerId
          if (this.entityId === 'facebook' || this.entityId === 'google') {
            this.entityId =
              this.entityId.charAt(0).toUpperCase() + this.entityId.slice(1)
          }
          this.loadedFeed = true
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
