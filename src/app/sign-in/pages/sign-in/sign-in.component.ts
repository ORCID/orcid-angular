import { Component, Inject, OnInit, ViewChild } from '@angular/core'
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
  params: HttpParams
  loading = false
  isLoggedIn = false
  displayName: string
  realUserOrcid: string
  email = ''
  oauthRequest = false
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
        // More info about signin query paramter https://members.orcid.org/api/oauth/get-oauthauthorize
        take(1),
        tap((value: OauthParameters) => {
          this.oauthParameters = value

          if (this.oauthParameters.email) {
            this.email = this.oauthParameters.email
          }
        })
      )
      .subscribe()

    _userInfo
      .getUserInfoOnEachStatusUpdate()
      .pipe(take(1))
      .subscribe((info) => {
        this.isLoggedIn = info.loggedIn
        if (this.isLoggedIn) {
          this.displayName = info.displayName
          this.realUserOrcid = info.orcidUrl
        }
      })
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
