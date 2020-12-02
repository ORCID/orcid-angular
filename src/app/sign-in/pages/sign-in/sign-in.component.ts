import { HttpParams } from '@angular/common/http'
import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { combineLatest } from 'rxjs'
import { first } from 'rxjs/operators'
import { UserSession } from 'src/app/types/session.local'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
import { UserService } from '../../../core'
import { OauthService } from '../../../core/oauth/oauth.service'
import { RequestInfoForm } from '../../../types/request-info-form.endpoint'
import { TypeSignIn } from '../../../types/sign-in.local'
import { FormSignInComponent } from '../../components/form-sign-in/form-sign-in.component'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss-theme.scss',
    './sign-in.component.scss',
  ],
  host: { class: 'container' },
  preserveWhitespaces: true,
})
export class SignInComponent implements OnInit {
  @ViewChild('formSignInComponent') formSignInComponent: FormSignInComponent
  requestInfoForm: RequestInfoForm // deprecated
  params: HttpParams // deprecated
  loading = false // TODO @Daniel seems like some progress bars depend on this but is never true
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
  verifiedEmail: string
  emailVerified: boolean
  invalidVerifyUrl: boolean

  constructor(
    _platformInfo: PlatformInfoService,
    _userInfo: UserService,
    _oauthService: OauthService,
    @Inject(WINDOW) private window: Window,
    _route: ActivatedRoute
  ) {
    combineLatest([_userInfo.getUserSession(), _platformInfo.get()])
      .pipe(first())
      .subscribe(([session, platform]) => {
        session = session as UserSession
        platform = platform as PlatformInfo

        this.isLoggedIn = session.loggedIn
        this.isForceLogin = session.oauthSession?.forceLogin
        if (this.isLoggedIn) {
          this.displayName = session.displayName
          this.realUserOrcid = session.orcidUrl
        } else {
          this.displayName = null
          this.realUserOrcid = null
        }

        if (platform.queryParameters.emailVerified) {
          this.emailVerified = platform.queryParameters.emailVerified
          if (
            platform.queryParameters.emailVerified &&
            platform.queryParameters.verifiedEmail
          ) {
            this.verifiedEmail = platform.queryParameters.verifiedEmail
          }
        }

        if (platform.queryParameters.invalidVerifyUrl) {
          this.invalidVerifyUrl = platform.queryParameters.invalidVerifyUrl
        }

        if (platform.queryParameters.email) {
          this.email = platform.queryParameters.email
        }
        if (session.oauthSession && session.oauthSession.userId) {
          this.email = session.oauthSession.userId
        }
      })
  }

  ngOnInit() {}

  show2FAEmitter($event) {
    this.show2FA = true
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
