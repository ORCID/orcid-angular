import {
  AfterViewInit,
  ChangeDetectorRef,
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
import { catchError, first, map } from 'rxjs/operators'
import { isRedirectToTheAuthorizationPage } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { OauthParameters, RequestInfoForm } from 'src/app/types'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
import { GoogleAnalyticsService } from '../../../core/google-analytics/google-analytics.service'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { UsernameValidator } from '../../../shared/validators/username/username.validator'
import { SignInData } from '../../../types/sign-in-data.endpoint'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { TwoFactorComponent } from '../two-factor/two-factor.component'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { SignInGuard } from '../../../guards/sign-in.guard'
import { OauthService } from '../../../core/oauth/oauth.service'
import { combineLatest } from 'rxjs'
import { UserSession } from 'src/app/types/session.local'
import { ERROR_REPORT } from 'src/app/errors'

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
  @Output() isOauthError = new EventEmitter<boolean>()
  @Output() show2FAEmitter = new EventEmitter<object>()
  @Output() loading = new EventEmitter<boolean>()
  @Output() errorDescription = new EventEmitter<string>()

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
  platform: PlatformInfo

  constructor(
    private _user: UserService,
    private _platformInfo: PlatformInfoService,
    private _route: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
    private _signIn: SignInService,
    private _oauthService: OauthService,
    private _router: Router,
    private _gtag: GoogleAnalyticsService,
    private _errorHandler: ErrorHandlerService,
    private _signInGuard: SignInGuard,
    private _userInfo: UserService,
    private cd: ChangeDetectorRef
  ) {
    this.signInLocal.type = this.signInType
    combineLatest([_userInfo.getUserSession(), _platformInfo.get()])
      .pipe(first())
      .subscribe(([session, platform]) => {
        session = session as UserSession
        platform = platform as PlatformInfo
        this.platform = platform

        if (session.oauthSession) {
          this.signInLocal.isOauth = true
          _route.queryParams.subscribe((params) => {
            this.signInLocal.params = {
              ...(params as OauthParameters),
            }
          })
        }

        if (platform.social) {
          this.signInLocal.type = TypeSignIn.social
        } else if (platform.institutional) {
          this.signInLocal.type = TypeSignIn.institutional
        }

        if (platform.social || platform.institutional) {
          this._user
            .getUserSession()
            .pipe(first())
            .subscribe((userSession) => {
              if (
                userSession.oauthSession &&
                userSession.oauthSession.clientId
              ) {
                this.signInLocal.isOauth = true
              }
            })
        }
      })
  }

  ngOnInit(): void {
    this.authorizationForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      recoveryCode: new FormControl(),
      verificationCode: new FormControl(),
    })

    if (this.email) {
      this.authorizationForm.patchValue({
        username: this.email,
      })
      this.addUsernameValidation()
    }
    this.cd.detectChanges()
  }

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus()
    this.cd.detectChanges()
  }

  onSubmit() {
    this.addUsernameValidation()

    if (this.authorizationForm.valid) {
      this.signInLocal.data = this.authorizationForm.getRawValue()
      this.hideErrors()
      this.loading.next(true)

      const isOauth = this.signInLocal.isOauth
      const willNotNavigateOutOrcidAngular = isOauth
      const forceSessionUpdate = isOauth
      const $signIn = this._signIn.signIn(
        this.signInLocal,
        willNotNavigateOutOrcidAngular,
        forceSessionUpdate
      )
      $signIn.subscribe((data) => {
        this.printError = false
        if (data.success) {
          if (isRedirectToTheAuthorizationPage(data)) {
            this.handleOauthLogin(data.url)
          } else {
            this._gtag
              .reportEvent('Sign-In', 'RegGrowth', 'Website')
              .pipe(
                catchError((err) =>
                  this._errorHandler.handleError(
                    err,
                    ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
                  )
                )
              )
              .subscribe(
                () => this.navigateTo(data.url),
                () => this.navigateTo(data.url)
              )
          }
        } else if (data.verificationCodeRequired && !data.badVerificationCode) {
          this.loading.next(false)
          this.show2FA = true
          this.show2FAEmitter.emit()
        } else {
          this.loading.next(false)
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
    } else {
      if (
        this.authorizationForm.get('username').hasError('required') ||
        this.authorizationForm.get('username').hasError('invalidUserName')
      ) {
        this.firstInput.nativeElement.focus()
      }
    }
  }

  authenticate($event) {
    this.resetTwoFactor()
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
        if (platform.social || platform.institutional) {
          if (this.signInData) {
            const {
              email,
              firstName,
              lastName,
              providerId,
              linkType,
            } = this.signInData
            this._user
              .getUserSession()
              .pipe(first())
              .subscribe((userSession) => {
                const params = platform.queryParameters
                this._router.navigate(['/register'], {
                  // TODO leomendoza123
                  // Adding the social/institutional parameters on the URL causes issues
                  // https://trello.com/c/EiZOE6b1/7138

                  queryParams: {
                    ...params,
                    email,
                    firstName,
                    lastName,
                    providerId,
                    linkType,
                  },
                })
              })
          } else {
            this._errorHandler.handleError(new Error('signingMissingData'))
          }
        } else {
          this._router.navigate(['/register'], {
            queryParams: platform.queryParameters,
          })
        }
      })
  }

  forgotPassword() {
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._router.navigate(['/reset-password'], {
          queryParams: platform.queryParameters,
        })
      })
  }

  handleOauthLogin(urlRedirect) {
    this._user
      .getUserSession()
      .pipe(
        first(),
        map((value) => value.oauthSession)
      )
      .subscribe((requestInfoForm: RequestInfoForm) => {
        if (requestInfoForm.error === 'invalid_grant') {
          this.isOauthError.next(true)
          this.loading.next(false)
          this.errorDescription.next(requestInfoForm.errorDescription)
        }
        this._gtag
          .reportEvent('Sign-In', 'RegGrowth', requestInfoForm)
          .pipe(
            catchError((err) =>
              this._errorHandler.handleError(
                err,
                ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
              )
            )
          )
          .subscribe(
            () => this.oauthAuthorize(urlRedirect),
            () => this.oauthAuthorize(urlRedirect)
          )
      })
  }

  oauthAuthorize(urlRedirect) {
    if (this.platform.social || this.platform.institutional) {
      this.navigateTo(urlRedirect)
    } else {
      this._router.navigate(['/oauth/authorize'], {
        queryParams: { ...this.signInLocal.params, prompt: undefined },
      })
    }
  }

  updateUsername(email) {
    this.authorizationForm.patchValue({
      username: email,
    })
  }

  resetTwoFactor() {
    this.authorizationForm.patchValue({
      verificationCode: '',
    })
    this.authorizationForm.patchValue({
      recoveryCode: '',
    })
  }

  addUsernameValidation() {
    this.authorizationForm
      .get('username')
      .setValidators([Validators.required, UsernameValidator.orcidOrEmail])
    this.authorizationForm.get('username').updateValueAndValidity()
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
