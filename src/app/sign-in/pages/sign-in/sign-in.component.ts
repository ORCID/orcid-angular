import { HttpParams } from '@angular/common/http'
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { combineLatest } from 'rxjs'
import { first } from 'rxjs/operators'
import { UserSession } from 'src/app/types/session.local'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
import { UserService } from '../../../core'
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
  preserveWhitespaces: true,
})
export class SignInComponent implements OnInit {
  @HostBinding('class.container') containerClass = true
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
  emailVerified: boolean
  invalidVerifyUrl: boolean

  constructor(
    private _platformInfo: PlatformInfoService,
    private _userInfo: UserService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    combineLatest([this._userInfo.getUserSession(), this._platformInfo.get()])
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

  show2FAEmitter($event) {
    this.show2FA = true
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
