import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { UserService } from '../../../core'
import { environment } from 'src/environments/environment'
import { WINDOW } from '../../../cdk/window'
import { tap, first } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { OauthParameters } from 'src/app/types'
import { RequestInfoForm } from '../../../types/request-info-form.endpoint'
import { OauthService } from '../../../core/oauth/oauth.service'
import { HttpParams } from '@angular/common/http'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { PlatformInfoService } from '../../../cdk/platform-info'
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
  oauthParameters: OauthParameters // deprecated
  requestInfoForm: RequestInfoForm // deprecated
  params: HttpParams // deprecated
  loading = false // TODO @Daniel seems like some progress bars depend on this but is never true
  isLoggedIn = false
  isForceLogin = false
  displayName: string
  realUserOrcid: string
  email = ''
  oauthRequest = false // deprecated
  show2FA = false
  signInType = TypeSignIn.personal

  constructor(
    _platformInfo: PlatformInfoService,
    private _userInfo: UserService,
    private _oauthService: OauthService,
    @Inject(WINDOW) private window: Window,
    _route: ActivatedRoute,
    private _router: Router
  ) {
    _route.queryParams
      .pipe(
        first(),
        tap((value: OauthParameters) => {
          this.oauthParameters = value
          if (value.email) {
            this.email = value.email
          }
        })
      )
      .subscribe()

    _userInfo
      .getUserSession()
      .pipe(first())
      .subscribe((session) => {
        this.isLoggedIn = session.loggedIn
        this.isForceLogin = session.oauthSession?.forceLogin
        if (this.isLoggedIn) {
          this.displayName = session.displayName
          this.realUserOrcid = session.orcidUrl
        } else {
          this.displayName = null
          this.realUserOrcid = null
        }
      })
  }

  ngOnInit() {}

  show2FAEmitter($event) {
    this.show2FA = true
  }

  /**
   * @deprecated the redirects are now handle on the guards and the email
   * and the update
   */
  loadRequestInfoForm(): void {
    this._oauthService.loadRequestInfoForm().subscribe((data) => {
      if (data) {
        this.requestInfoForm = data
        if (this.requestInfoForm.userId) {
          this.formSignInComponent.updateUsername(this.oauthParameters.email)
        } else {
          if (
            this.requestInfoForm.userEmail ||
            this.requestInfoForm.userFamilyNames ||
            this.requestInfoForm.userGivenNames
          ) {
            this._router.navigate(['/register'], {
              queryParams: this.oauthParameters,
            })
          }
        }
      }
    })
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
