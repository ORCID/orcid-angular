import { Component, Inject } from '@angular/core'
import { cloneDeep } from 'lodash'
import { first, tap } from 'rxjs/operators'
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

  constructor(
    _user: UserService,
    private _platformInfo: PlatformInfoService,
    private _recordEmails: RecordEmailsService,
    private _togglz: TogglzService,
    @Inject(WINDOW) private window: Window
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
    this._togglz.getStateOf('OAUTH_DOMAINS_INTERSTITIAL').subscribe((value) => {
      this.oauthDomainsInterstitialEnabled = value
    })
    this._recordEmails
      .getEmails()
      .pipe(
        tap((value) => {
          this.originalEmailsBackendCopy = cloneDeep(value)
          this.userHasPrivateDomains = this.userHasPrivateEmails(value)
        }),
        first()
      )
      .subscribe()
  }

  userHasPrivateEmails(value: EmailsEndpoint): boolean {
    return !!value.emailDomains.find(
      (domain) => domain.visibility !== 'PUBLIC'
    )
  }

  handleRedirect(url: string) {
    if (url && this.userHasPrivateDomains && this.oauthDomainsInterstitialEnabled) {
      this.redirectUrl = url
      this.showAuthorizationComponent = false
      this.showInterstital = true
    } else {
      this.finishRedirect()
    }
  }
  finishRedirect() {
    ;(this.window as any).outOfRouterNavigation(this.redirectUrl)
  }
}
