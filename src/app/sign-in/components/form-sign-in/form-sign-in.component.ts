import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { first, map } from 'rxjs/operators'
import { isARedirectToTheAuthorizationPage } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { OauthParameters } from 'src/app/types'

import { PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
import { GoogleAnalyticsService } from '../../../core/google-analytics/google-analytics.service'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { UsernameValidator } from '../../../shared/validators/username/username.validator'
import { SignInData } from '../../../types/sign-in-data.endpoint'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { TwoFactorComponent } from '../two-factor/two-factor.component'

@Component({
  selector: 'app-form-sign-in',
  templateUrl: './form-sign-in.component.html',
  styleUrls: ['./form-sign-in.component.scss'],
  providers: [TwoFactorComponent],
  preserveWhitespaces: true,
})
export class FormSignInComponent implements OnInit, AfterViewInit {
  @ViewChild('firstInput') firstInput: ElementRef
  @Input() signInType: TypeSignIn
  @Input() signInData: SignInData
  @Output() show2FAEmitter = new EventEmitter<object>()

  loading = false
  badCredentials = false
  printError = false
  show2FA = false
  showDeprecatedError = false
  showDeactivatedError = false
  showUnclaimedError = false
  showBadVerificationCode = false
  showBadRecoveryCode = false
  showInvalidUser = false
  @Input() email
  orcidPrimaryDeprecated: string
  signInLocal = {} as SignInLocal
  authorizationForm: FormGroup
  usernameFormControl: FormControl
  passwordFormControl: FormControl

  constructor(
    private _user: UserService,
    private _platformInfo: PlatformInfoService,
    _route: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
    private _signIn: SignInService,
    private _router: Router,
    private _gtag: GoogleAnalyticsService
  ) {
    this.signInLocal.type = this.signInType
    _platformInfo.get().subscribe((platform) => {
      if (platform.oauthMode) {
        this.signInLocal.type = TypeSignIn.oauth
        _route.queryParams.subscribe((params) => {
          this.signInLocal.params = {
            ...(params as OauthParameters),
            oauth: '',
          }
        })
      } else if (platform.social) {
        this.signInLocal.type = TypeSignIn.social
      } else if (platform.institutional) {
        this.signInLocal.type = TypeSignIn.institutional
      }
    })
  }

  ngOnInit(): void {
    this.usernameFormControl = new FormControl(this.email, [
      Validators.required,
      UsernameValidator.orcidOrEmail,
    ])
    this.passwordFormControl = new FormControl('', [])

    this.authorizationForm = new FormGroup({
      username: this.usernameFormControl,
      password: this.passwordFormControl,
      recoveryCode: new FormControl(),
      verificationCode: new FormControl(),
    })
  }

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus()
  }

  onSubmit() {
    this.signInLocal.data = this.authorizationForm.getRawValue()

    this.authorizationForm.markAllAsTouched()

    if (this.authorizationForm.valid) {
      this.hideErrors()
      this.loading = true

      const isOauth = this.signInLocal.type === TypeSignIn.oauth
      const $signIn = this._signIn.signIn(this.signInLocal, isOauth)
      $signIn.subscribe((data) => {
        this.loading = false
        this.printError = false

        if (data.success) {
          if (isARedirectToTheAuthorizationPage(data)) {
            this.handleOauthLogin()
          } else {
            this._gtag.reportEvent('RegGrowth', 'Sign-In', 'Website').subscribe(
              () => this.navigateTo(data.url),
              () => this.navigateTo(data.url)
            )
          }
        } else if (data.verificationCodeRequired && !data.badVerificationCode) {
          this.show2FA = true
          this.show2FAEmitter.emit()
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

  register() {
    // always send the user with all query parameters
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._router.navigate(['/register'], {
          queryParams: platform.queryParameters,
        })
      })
  }

  handleOauthLogin() {
    this._user
      .getUserSession()
      .pipe(
        first(),
        map((value) => value.oauthSession)
      )
      .subscribe((requestInfoForm) => {
        this._gtag
          .reportEvent('RegGrowth', 'Sign-In', requestInfoForm)
          .subscribe(
            () => this.oauthAuthorize(),
            () => this.oauthAuthorize()
          )
      })
  }

  oauthAuthorize() {
    this._router.navigate(['/oauth/authorize'], {
      queryParams: this.signInLocal.params,
    })
  }

  updateUsername(email) {
    this.authorizationForm.patchValue({
      username: email,
    })
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
