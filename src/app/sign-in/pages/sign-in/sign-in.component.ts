import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { UserService } from '../../../core'
import { environment } from 'src/environments/environment'
import { TwoFactorComponent } from '../../components/two-factor/two-factor.component'
import { take, tap } from 'rxjs/operators'
import { UsernameValidator } from '../../../shared/validators/username/username.validator'
import { ActivatedRoute, Router } from '@angular/router'
import { OauthParameters } from 'src/app/types'
import { Location } from '@angular/common'
import { RequestInfoForm } from '../../../types/request-info-form.endpoint'
import { OauthService } from '../../../core/oauth/oauth.service'
import { HttpParams } from '@angular/common/http'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { PlatformInfoService } from '../../../cdk/platform-info'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss-theme.scss',
    './sign-in.component.scss',
  ],
  providers: [TwoFactorComponent],
  host: { class: 'container' },
})
export class SignInComponent implements OnInit {
  oauthParameters: OauthParameters
  requestInfoForm: RequestInfoForm
  signInLocal = {} as SignInLocal
  params: HttpParams
  loading = false
  badCredentials = false
  printError = false
  showDeprecatedError = false
  showDeactivatedError = false
  showUnclaimedError = false
  showBadVerificationCode = false
  showBadRecoveryCode = false
  showInvalidUser = false
  show2FA = false
  isLoggedIn = false
  displayName: string
  realUserOrcid: string
  email: string
  orcidPrimaryDeprecated: string
  oauthRequest = false

  constructor(
    _platformInfo: PlatformInfoService,
    private _signIn: SignInService,
    private _userInfo: UserService,
    private _oauthService: OauthService,
    @Inject(WINDOW) private window: Window,
    _route: ActivatedRoute,
    private _router: Router,
    _location: Location
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

          // TODO handle redirection in the backend
          if (this.oauthParameters.show_login === 'false') {
            this._router.navigate(['/register'], {
              queryParams: this.oauthParameters,
            })
          }

          if (this.oauthParameters.email) {
            this.authorizationForm.patchValue({
              username: this.oauthParameters.email,
            })
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
            this.confirmAccess()
          }
          _userInfo
            .getUserInfoOnEachStatusUpdate()
            .pipe(take(1))
            .subscribe((info) => {
              this.displayName = info.displayName
              this.realUserOrcid =
                'https:' + environment.BASE_URL + info.userInfo.REAL_USER_ORCID
            })
        }
      })
  }

  usernameFormControl = new FormControl('', [
    Validators.required,
    UsernameValidator.orcidOrEmail,
  ])
  passwordFormControl = new FormControl('', [])

  authorizationForm = new FormGroup({
    username: this.usernameFormControl,
    password: this.passwordFormControl,
    recoveryCode: new FormControl(),
    verificationCode: new FormControl(),
  })

  ngOnInit() {}

  onSubmit() {
    this.signInLocal.data = this.authorizationForm.getRawValue()

    this.authorizationForm.markAllAsTouched()

    if (this.authorizationForm.valid) {
      this.hideErrors()
      this.loading = true

      const $signIn = this._signIn.signIn(this.signInLocal)
      $signIn.subscribe((data) => {
        this.loading = false
        this.printError = false
        if (data.success) {
          this.navigateTo(data.url)
        } else if (data.verificationCodeRequired && !data.badVerificationCode) {
          this.show2FA = true
        } else {
          if (data.deprecated) {
            this.showDeprecatedError = true
            this.orcidPrimaryDeprecated = data.primary
          } else if (data.disabled) {
            this.showDeactivatedError = true
            this.email = this.authorizationForm.value.username
          } else if (data.unclaimed) {
            this.showUnclaimedError = true
            this.email = this.authorizationForm.value.username
          } else if (data.badVerificationCode) {
            this.showBadVerificationCode = true
          } else if (data.badRecoveryCode) {
            this.showBadRecoveryCode = true
          } else if (data.invalidUserType) {
            this.showInvalidUser = true
          } else {
            this.badCredentials = true
          }
          this.printError = true
        }
      })
    }
  }

  authenticate($event) {
    if ($event.recoveryCode) {
      this.authorizationForm.patchValue({
        recoveryCode: $event.recoveryCode,
      })
      this.onSubmit()
    } else if ($event.verificationCode) {
      this.authorizationForm.patchValue({
        verificationCode: $event.verificationCode,
      })
      this.onSubmit()
    }
  }

  hideErrors() {
    this.showBadVerificationCode = false
    this.showBadRecoveryCode = false
    this.showDeprecatedError = false
    this.showDeactivatedError = false
    this.showUnclaimedError = false
    this.showBadVerificationCode = false
    this.showBadRecoveryCode = false
    this.showInvalidUser = false
    this.badCredentials = false
  }

  loadRequestInfoForm(): void {
    this._oauthService.loadRequestInfoForm().subscribe((data) => {
      if (data) {
        this.requestInfoForm = data
        if (this.requestInfoForm.userId) {
          this.authorizationForm.patchValue({
            username: this.requestInfoForm.userId,
          })
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
