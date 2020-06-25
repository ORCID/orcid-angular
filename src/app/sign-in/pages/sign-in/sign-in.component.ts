import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { UserService } from '../../../core'
import { environment } from 'src/environments/environment'
import { WINDOW } from '../../../cdk/window'
import { take, tap } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { OauthParameters } from 'src/app/types'
import { RequestInfoForm } from '../../../types/request-info-form.endpoint'
import { OauthService } from '../../../core/oauth/oauth.service'
import { HttpParams } from '@angular/common/http'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { SignInService } from '../../../core/sign-in/sign-in.service'
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
  oauthParameters: OauthParameters
  requestInfoForm: RequestInfoForm
  signInLocal = {} as SignInLocal
  params: HttpParams
  loading = false
  isLoggedIn = false
  displayName: string
  realUserOrcid: string
  email: string
  oauthRequest = false
  show2FA = false
  signInType = TypeSignIn.personal

  constructor(
    _platformInfo: PlatformInfoService,
    private _signIn: SignInService,
    private _userInfo: UserService,
    private _oauthService: OauthService,
    @Inject(WINDOW) private window: Window,
    _route: ActivatedRoute,
    private _router: Router
  ) {
    _platformInfo.get().subscribe((platform) => {
      if (platform.oauthMode) {
        this.signInLocal.type = TypeSignIn.oauth
        this.loadRequestInfoForm()
      }
    })

    _route.queryParams
      .pipe(
        // More info about signin query paramter https://members.orcid.org/api/oauth/get-oauthauthorize
        take(1),
        tap((value: OauthParameters) => {
          this.oauthParameters = value

          // TODO @DanielPalafox handle redirection Guard
          // with the purpose of avoiding the load of the signin module if is not required
          if (this.oauthParameters.show_login === 'false') {
            this._router.navigate(['/register'], {
              queryParams: this.oauthParameters,
            })
          }

          if (this.oauthParameters.email) {
            this.formSignInComponent.updateUsername(this.oauthParameters.email)
          }
        })
      )
      .subscribe()

    _userInfo
      .getUserStatus()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.isLoggedIn = data
          if (this.signInLocal.type === TypeSignIn.oauth) {
            // TODO @DanielPalafox handle redirection a Guard
            //
            // to prevent loading the signin module or showing the "you are already logged in"
            // related to https://github.com/ORCID/orcid-angular/issues/261
            this.confirmAccess()
          }
          // TODO @DanielPalafox remove the first call to `getUserStatus`
          // since `getUserInfoOnEachStatusUpdate` already calls `getUserStatus` and is not great to call the same endpoint two times
          //
          // this might be possible by returning maybe a false from `getUserInfoOnEachStatusUpdate`
          // instead of nothing as it currently does when the user is not signin
          _userInfo
            .getUserInfoOnEachStatusUpdate()
            .pipe(take(1))
            .subscribe((info) => {
              this.displayName = info.displayName
              this.realUserOrcid = info.orcidUrl
            })
        }
      })

    _route.queryParams
      .pipe(
        // More info about signin query paramter https://members.orcid.org/api/oauth/get-oauthauthorize
        take(1),
        tap((value: OauthParameters) => {
          if (value.show_login === 'false') {
            this._router.navigate(['/register'], { queryParams: value })
          }
        })
      )
      .subscribe()
  }

  ngOnInit() {}

  show2FAEmitter($event) {
    this.show2FA = true
  }

  loadRequestInfoForm(): void {
    this._oauthService.loadRequestInfoForm().subscribe((data) => {
      if (data) {
        // TODO @DanielPalafox Handle scenario where the user directly navigates to `/signin?oauth` url
        // https://github.com/ORCID/orcid-angular/issues/260
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

  confirmAccess() {
    this.navigateTo('https:' + environment.BASE_URL + 'oauth/confirm_access')
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
