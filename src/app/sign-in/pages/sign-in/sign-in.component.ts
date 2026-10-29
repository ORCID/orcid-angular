import { HttpParams } from '@angular/common/http'
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { combineLatest } from 'rxjs'
import { first, map, take } from 'rxjs/operators'
import { UserSession } from 'src/app/types/session.local'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
import { UserService } from '../../../core'
import { LegacyOauthRequestInfoForm as RequestInfoForm } from '../../../types/request-info-form.endpoint'
import { TypeSignIn } from '../../../types/sign-in.local'
import { FormSignInComponent } from '../../components/form-sign-in/form-sign-in.component'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ActivatedRoute, Router } from '@angular/router'
import { OauthParameters } from 'src/app/types'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { isRedirectToTheAuthorizationPage } from 'src/app/constants'
import { OauthURLSessionManagerService } from 'src/app/core/oauth-urlsession-manager/oauth-urlsession-manager.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss-theme.scss',
    './sign-in.component.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class SignInComponent implements OnInit {
  @HostBinding('class.container') containerClass = true
  @ViewChild('formSignInComponent') formSignInComponent: FormSignInComponent

  requestInfoForm: RequestInfoForm // deprecated
  params: HttpParams // deprecated
  loading = false
  isLoggedIn = false
  isForceLogin = false
  isOauthError = false
  displayName: string
  realUserOrcid: string
  email = ''
  oauthRequest = false // deprecated
  show2FA = false
  signInType = TypeSignIn.personal
  errorDescription: string
  emailVerified: boolean
  invalidVerifyUrl: boolean
  platform: PlatformInfo
  orLabel = $localize`:@@ngOrcid.signin.or:or`
  isOauthAuthorizationTogglzEnable = false

  /**
   * The user signed in with their recovery phone number on an OAuth request.
   * The sign-in card gives way to a panel that says 2FA is now off, and the
   * client is only reached when that panel continues (R4.2).
   */
  twoFactorDisabledByRecoveryPhone = false
  twoFactorDisabledRedirectUrl: string
  /** The client's name, when the OAuth session carries one. */
  oauthClientName: string
  private twoFactorDisabledRedirectTriggered = false

  constructor(
    private _platformInfo: PlatformInfoService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userInfo: UserService,
    private _togglzService: TogglzService,
    private _oauthUrlSessionManager: OauthURLSessionManagerService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    combineLatest([
      this._userInfo.getUserSession(),
      this._platformInfo.get(),
      this._togglzService
        .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
        .pipe(take(1)),
    ])
      .pipe(first())
      .subscribe(([session, platform, isOauthAuthorizationTogglzEnable]) => {
        session = session as UserSession
        this.platform = platform as PlatformInfo

        this.isLoggedIn = session.loggedIn
        this.isOauthAuthorizationTogglzEnable = isOauthAuthorizationTogglzEnable
        this.oauthClientName = session.oauthSession?.clientName
        if (!isOauthAuthorizationTogglzEnable) {
          this.isForceLogin = session.oauthSession?.forceLogin
        } else {
          this.isForceLogin =
            platform.queryParameters.show_login === 'true' ||
            platform.queryParameters.prompt === 'login'
        }

        if (this.isLoggedIn) {
          this.displayName = session.displayName
          this.realUserOrcid = session.orcidUrl
        } else {
          this.displayName = null
          this.realUserOrcid = null
        }

        if (platform.queryParameters.emailVerified) {
          this.emailVerified = platform.queryParameters.emailVerified
        }

        if (platform.queryParameters.invalidVerifyUrl) {
          this.invalidVerifyUrl = platform.queryParameters.invalidVerifyUrl
        }

        if (platform.queryParameters.email) {
          this.email = platform.queryParameters.email
        }

        if (platform.queryParameters.orcid) {
          this.email = platform.queryParameters.orcid
        }

        if (session.oauthSession && session.oauthSession.userId) {
          this.email = session.oauthSession.userId
        }
      })
  }

  register() {
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._router.navigate(['/register'], {
          queryParams: platform.queryParameters,
        })
      })
  }

  show2FAEmitter($event) {
    this.show2FA = true
  }

  /**
   * The sign-in behind an OAuth request succeeded on a recovery number code.
   * Hold the url the sign-in answered with and show the panel instead of
   * following it (R4.2).
   */
  onTwoFactorDisabledByRecoveryPhone($event: { url: string }) {
    this.twoFactorDisabledRedirectUrl = $event?.url
    this.twoFactorDisabledByRecoveryPhone = true
    this.show2FA = false
    this.loading = false
  }

  /**
   * Continues to the client, by the button or by the panel's own ten-second
   * timer. This is the continuation the ordinary OAuth success path takes -
   * see FormSignInComponent.oauthAuthorize - repeated here because the form,
   * and its redirect, are gone by the time the panel is on screen.
   */
  continueAfterTwoFactorDisabled() {
    if (this.twoFactorDisabledRedirectTriggered) {
      return
    }
    this.twoFactorDisabledRedirectTriggered = true
    let urlRedirect = this.twoFactorDisabledRedirectUrl

    if (this.isOauthAuthorizationTogglzEnable) {
      const storedOauthRedirectUrl = this._oauthUrlSessionManager.get()
      if (storedOauthRedirectUrl) {
        urlRedirect = storedOauthRedirectUrl
        this._oauthUrlSessionManager.clear()
      }
      //add http if not present
      if (urlRedirect && !urlRedirect.startsWith('https://')) {
        urlRedirect = `https://${urlRedirect}`
      }
      this.navigateTo(urlRedirect)
    } else {
      if (
        (this.platform?.social || this.platform?.institutional) &&
        !isRedirectToTheAuthorizationPage({ url: urlRedirect })
      ) {
        this.navigateTo(urlRedirect)
      } else {
        this._router.navigate(['/oauth/authorize'], {
          queryParams: {
            ...this.platform?.queryParameters,
            prompt: undefined,
            show_login: undefined,
          },
        })
      }
    }
  }

  navigateTo(val) {
    ;(this.window as any).outOfRouterNavigation(val)
  }
}
