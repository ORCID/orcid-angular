import { Component, Inject } from '@angular/core'
import { cloneDeep } from 'lodash'
import { first, take, tap } from 'rxjs/operators'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'

@Component({
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent {
  redirectUrl: string

  platform: PlatformInfo
  showAuthorizationComponent: boolean
  showAuthorizationError: boolean
  showInterstital: boolean
  originalEmailsBackendCopy: EmailsEndpoint
  userHasPrivateDomains = false
  oauthDomainsInterstitialEnabled: boolean
  organizationName: string
  domainInterstitialHasBeenViewed: boolean
  userIsNotImpersonating: boolean
  insidePopUpWindows: boolean
  userHasPublicDomains: boolean

  constructor(
    _user: UserService,
    private _platformInfo: PlatformInfoService,
    private _recordEmails: RecordEmailsService,
    private _togglz: TogglzService,
    private _interstitials: InterstitialsService,
    @Inject(WINDOW) private window: Window,
    private _userInfo: UserService
  ) {
    _user.getUserSession().subscribe((session) => {
      if (session.oauthSession && session.oauthSession.error) {
        this.showAuthorizationError = true
      } else {
        this.showAuthorizationComponent = true
      }
    })
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
  }

  ngOnInit() {
    this.insidePopUpWindows = this.window.opener !== null
    this._userInfo.getUserSession().subscribe((userInfo) => {
      this.userIsNotImpersonating =
        userInfo.userInfo.REAL_USER_ORCID ===
        userInfo.userInfo.EFFECTIVE_USER_ORCID
    })
    this._interstitials
      .getInterstitialsViewed('OAUTH_DOMAIN_INTERSTITIAL')
      .subscribe((value) => {
        return (this.domainInterstitialHasBeenViewed = value)
      })

    this._togglz
      .getStateOf('OAUTH_DOMAINS_INTERSTITIAL')
      .pipe(take(1))
      .subscribe((value) => {
        this.oauthDomainsInterstitialEnabled = value
      })
    this._recordEmails
      .getEmails()
      .pipe(
        tap((value) => {
          this.originalEmailsBackendCopy = cloneDeep(value)
          this.userHasPrivateDomains = this.userHasPrivateEmails(value)
          this.userHasPublicDomains = this.userHasPublicEmails(value)
        }),
        first()
      )
      .subscribe()
  }
  userHasPublicEmails(value: EmailsEndpoint): any {
    return !!value.emailDomains.find((domain) => domain.visibility === 'PUBLIC')
  }

  userHasPrivateEmails(value: EmailsEndpoint): boolean {
    return !!value.emailDomains.find((domain) => domain.visibility !== 'PUBLIC')
  }

  handleRedirect(url: string) {
    this.redirectUrl = url
    if (
      url &&
      this.userHasPrivateDomains &&
      !this.userHasPublicDomains &&
      this.oauthDomainsInterstitialEnabled &&
      !this.domainInterstitialHasBeenViewed &&
      this.userIsNotImpersonating &&
      !this.insidePopUpWindows
    ) {
      this.showAuthorizationComponent = false
      this.showInterstital = true
      this._interstitials
        .setInterstitialsViewed('OAUTH_DOMAIN_INTERSTITIAL')
        .subscribe()
    } else {
      this.finishRedirect()
    }
  }
  finishRedirect() {
    ;(this.window as any).outOfRouterNavigation(this.redirectUrl)
  }
}
