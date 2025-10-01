import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, first, map, take, takeUntil, tap } from 'rxjs/operators'
import {
  ApplicationRoutes,
  isRedirectToTheAuthorizationPage,
} from 'src/app/constants'
import { UserService } from 'src/app/core'
import { OauthParameters } from 'src/app/types'
import { LegacyOauthRequestInfoForm as RequestInfoForm } from 'src/app/types/request-info-form.endpoint'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { UsernameValidator } from '../../../shared/validators/username/username.validator'
import { SignInData } from '../../../types/sign-in-data.endpoint'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { SignInGuard } from '../../../guards/sign-in.guard'
import { OauthService } from '../../../core/oauth/oauth.service'
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs'
import { UserSession } from 'src/app/types/session.local'
import { ERROR_REPORT } from 'src/app/errors'
import { ErrorStateMatcherForPasswordField } from '../../ErrorStateMatcherForPasswordField'
import { GoogleTagManagerService } from '../../../core/google-tag-manager/google-tag-manager.service'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { OauthURLSessionManagerService } from 'src/app/core/oauth-urlsession-manager/oauth-urlsession-manager.service'

@Component({
  selector: 'app-form-sign-in',
  templateUrl: './form-sign-in.component.html',
  styleUrls: [
    './form-sign-in.component.scss',
    '../sign-in.style.scss',
    '../sign-in.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class FormSignInComponent implements OnInit, OnDestroy {
  @ViewChild('firstInput') firstInput: ElementRef
  @Input() signInType: TypeSignIn
  @Input() signInData: SignInData
  @Output() isOauthError = new EventEmitter<boolean>()
  @Output() show2FAEmitter = new EventEmitter<object>()
  @Output() loading = new EventEmitter<boolean>()
  @Output() errorDescription = new EventEmitter<string>()
  @Input() showForgotYourPassword = true

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
  authorizationForm: UntypedFormGroup
  platform: PlatformInfo
  private readonly $destroy = new Subject()
  authorizationFormSubmitted: boolean
  backendErrorsMatcher = new ErrorStateMatcherForPasswordField()
  emailVerified: boolean
  invalidVerifyUrl: boolean

  placeholderUsername = $localize`:@@ngOrcid.signin.username:Email or 16-digit ORCID iD`
  placeholderPassword = $localize`:@@ngOrcid.signin.yourOrcidPassword:Your ORCID password`
  isOauthAuthorizationTogglzEnable: boolean

  get passwordForm() {
    return this.authorizationForm.controls.password
  }

  get usernameForm() {
    return this.authorizationForm.controls.username
  }

  constructor(
    private _user: UserService,
    private _platformInfo: PlatformInfoService,
    private _route: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
    private _signIn: SignInService,
    private _oauthService: OauthService,
    private _router: Router,
    private _googleTagManagerService: GoogleTagManagerService,
    private _errorHandler: ErrorHandlerService,
    private _signInGuard: SignInGuard,
    private _userInfo: UserService,
    private cd: ChangeDetectorRef,
    private _snackBar: SnackbarService,
    private _togglzService: TogglzService,
    private _oauthUrlSessionManager: OauthURLSessionManagerService,
    @Inject(WINDOW) private _window: any
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
        }
        _route.queryParams.subscribe((params) => {
          this.signInLocal.params = {
            ...(params as OauthParameters),
          }
        })

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

        if (platform.queryParameters.emailVerified) {
          this.emailVerified = platform.queryParameters.emailVerified
        }

        if (platform.queryParameters.invalidVerifyUrl) {
          this.invalidVerifyUrl = platform.queryParameters.invalidVerifyUrl
        }
      })
  }

  ngOnInit(): void {
    this._togglzService
      .getStateOf('OAUTH_AUTHORIZATION')
      .pipe(take(1))
      .subscribe((isOauthAuthorizationTogglzEnable) => {
        this.isOauthAuthorizationTogglzEnable = isOauthAuthorizationTogglzEnable
      })

    this.authorizationForm = new UntypedFormGroup({
      username: new UntypedFormControl(),
      password: new UntypedFormControl('', {
        validators: [Validators.maxLength(256)],
      }),
      recoveryCode: new UntypedFormControl(),
      verificationCode: new UntypedFormControl(),
    })

    if (this.email) {
      this.authorizationForm.patchValue({
        username: this.email,
      })
      this.addUsernameValidation()
    }
    this.cd.detectChanges()
    this.observeSessionUpdates()
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.complete()
  }

  onSubmit() {
    this.addUsernameValidation()

    if (this.authorizationForm.valid) {
      this.signInLocal.data = this.authorizationForm.getRawValue()
      this.hideErrors()
      this.loading.next(true)

      const isOauth = this.signInLocal.isOauth
      const willNotNavigateOutOrcidAngular = isOauth
      const $signIn = this._signIn.signIn(
        this.signInLocal,
        willNotNavigateOutOrcidAngular,
        true
      )
      this.authorizationFormSubmitted = true
      $signIn.subscribe((data) => {
        this.printError = false
        if (data.success) {
          if (isRedirectToTheAuthorizationPage(data)) {
            this.handleOauthLogin(data.url)
          } else {
            this.navigateTo(data.url)
          }
        } else if (data.verificationCodeRequired && !data.badVerificationCode) {
          this.authorizationFormSubmitted = false
          this.loading.next(false)
          this.show2FA = true
          this.show2FAEmitter.emit()
        } else {
          this.authorizationFormSubmitted = false
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
    this.printError = false
  }

  register() {
    // always send the user with all query parameters
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        if (platform.social || platform.institutional) {
          if (this.signInData) {
            const { providerId, linkType } = this.signInData
            this._user
              .getUserSession()
              .pipe(first())
              .subscribe((userSession) => {
                const params = platform.queryParameters
                this._router.navigate(['/register'], {
                  /// TODO @leomendoza123 depend only on the user session thirty party login data
                  /// avoid taking data from the the parameters.

                  queryParams: {
                    ...params,
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
        // TODO the following error needds to be migrated to the new Oauth Server or removed
        if (requestInfoForm?.error === 'invalid_grant') {
          this.isOauthError.next(true)
          this.authorizationFormSubmitted = false
          this.loading.next(false)
          this.errorDescription.next(requestInfoForm.errorDescription)
        }
        this.oauthAuthorize(urlRedirect)
      })
  }

  oauthAuthorize(urlRedirect) {
    if (this.isOauthAuthorizationTogglzEnable) {

      if (this._oauthUrlSessionManager.get()) {
        urlRedirect = this._oauthUrlSessionManager.get()
        this._oauthUrlSessionManager.clear()
      }
      //add http if not present
      if (!urlRedirect.startsWith('https://')) {
        urlRedirect = `https://${urlRedirect}`
      }
      this._window.outOfRouterNavigation(urlRedirect)
    } else {
      if (
        (this.platform.social || this.platform.institutional) &&
        !isRedirectToTheAuthorizationPage({ url: urlRedirect })
      ) {
        this.navigateTo(urlRedirect)
      } else {
        this._router.navigate(['/oauth/authorize'], {
          queryParams: {
            ...this.signInLocal.params,
            prompt: undefined,
            show_login: undefined,
          },
        })
      }
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

  navigateToClaim() {
    this.window.location.href = `/resend-claim?email=${encodeURIComponent(
      this.email
    )}`
  }

  signInActiveAccount() {
    this.usernameForm.setValue(this.orcidPrimaryDeprecated)
    this.showDeprecatedError = false
    this.printError = false
  }

  reactivateEmail() {
    const $deactivate = this._signIn.reactivation(this.email)
    $deactivate.subscribe((data) => {
      if (data.error) {
        this._errorHandler
          .handleError(
            new Error(data.error),
            ERROR_REPORT.REGISTER_REACTIVATED_EMAIL
          )
          .subscribe()
      } else {
        this._snackBar.showSuccessMessage({
          title: $localize`:@@register.reactivating:Reactivating your account`,
          // tslint:disable-next-line: max-line-length
          message: $localize`:@@ngOrcid.signin.verify.reactivationSent:Thank you for reactivating your ORCID record; please complete the process by following the steps in the email we are now sending you. If you don’t receive an email from us, please`,
          action: $localize`:@@shared.contactSupport:contact support.`,
          actionURL: `https://support.orcid.org/`,
          closable: true,
        })
        this._router.navigate([ApplicationRoutes.signin])
      }
    })
  }

  claimAccount() {
    const $deactivate = this._signIn.resendClaim(this.email)
    $deactivate.subscribe((data) => {
      if (data.errors && data.errors.length > 0) {
        this._errorHandler
          .handleError(new Error(data.errors[0]), ERROR_REPORT.STANDARD_VERBOSE)
          .subscribe()
      } else {
        this._snackBar.showSuccessMessage({
          title: $localize`:@@ngOrcid.signin.claiming:Claiming your account`,
          // tslint:disable-next-line: max-line-length
          message: $localize`:@@ngOrcid.signin.verify.claimSent:Thank you for claiming your ORCID record; please complete the process by following the steps in the email we are now sending you. If you don’t receive an email from us, please`,
          action: $localize`:@@shared.contactSupport:contact support.`,
          actionURL: `https://support.orcid.org/`,
          closable: true,
        })
        this._router.navigate([ApplicationRoutes.signin])
      }
    })
  }

  navigateTo(val: string): void {
    if (val.indexOf('orcid.org/my-orcid')) {
      this._router.navigate(['/my-orcid'])
    } else {
      this.window.location.href = val
    }
  }

  private observeSessionUpdates() {
    combineLatest([this._userInfo.getUserSession(), this._platformInfo.get()])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([session, platformInfo]) => {
        if (
          session?.userInfo?.REAL_USER_ORCID &&
          !this.authorizationFormSubmitted
        ) {
          if (!this.isForcedSignin(session, platformInfo)) {
            this.window.location.reload()
          }
        }
      })
  }

  private isForcedSignin(
    session: UserSession,
    platform: PlatformInfo
  ): boolean {
    if (!this.isOauthAuthorizationTogglzEnable) {
      return session.oauthSession?.forceLogin
    } else {
      return (
        platform.queryParameters.show_login === 'true' ||
        platform.queryParameters.prompt === 'login'
      )
    }
  }
}
