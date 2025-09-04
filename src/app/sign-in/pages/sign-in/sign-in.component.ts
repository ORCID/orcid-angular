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

  constructor(
    private _platformInfo: PlatformInfoService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userInfo: UserService,
    private _togglzService: TogglzService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    combineLatest([
      this._userInfo.getUserSession(),
      this._platformInfo.get(),
      this._togglzService.getStateOf('OAUTH_AUTHORIZATION').pipe(take(1)),
    ])
      .pipe(first())
      .subscribe(([session, platform, isOauthAuthorizationTogglzEnable]) => {
        session = session as UserSession
        this.platform = platform as PlatformInfo

        this.isLoggedIn = session.loggedIn
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

  navigateTo(val) {
    this.window.location.href = val
  }
}
