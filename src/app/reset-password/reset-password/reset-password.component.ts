import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { WINDOW } from 'src/app/cdk/window'
import {
  ApplicationRoutes,
  HAS_LETTER_OR_SYMBOL,
  HAS_NUMBER,
  isRedirectToTheAuthorizationPage,
} from 'src/app/constants'
import { OauthURLSessionManagerService } from 'src/app/core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { FormPasswordComponent } from '../../register/components/form-password/form-password.component'
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal'
import { AuthChallengeComponent } from '@orcid/registry-ui'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    './reset-password.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup
  hasNumberPattern = HAS_NUMBER
  hasLetterOrSymbolPattern = HAS_LETTER_OR_SYMBOL
  labelInfo = $localize`:@@register.ariaLabelInfoPassword:info about password`
  authChallengeTrailingText = $localize`:@@accountSettings.security.password.authChallengeTrailingText:to complete your password reset`
  authChallengeLeadingText = $localize`:@@accountSettings.security.password.authChallengeLeadingText:for`

  @ViewChild('passwordForm') passwordForm: FormPasswordComponent
  @ViewChild('authChallengeOutlet', { static: false, read: CdkPortalOutlet })
  outlet!: CdkPortalOutlet

  loading = false
  errors: string[]
  $destroy = new Subject<void>()
  token: string
  expiredPasswordResetToken: boolean
  invalidPasswordResetToken: boolean
  alreadyUsedPasswordResetToken: boolean
  isMobile: boolean
  isOauthAuthorizationTogglzEnable: boolean
  showForm = true
  showAuthChallenge = false

  constructor(
    private _fb: UntypedFormBuilder,
    private _register: RegisterService,
    private _accountRecoveryService: PasswordRecoveryService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: SnackbarService,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private _window: Window,
    private _togglzService: TogglzService,
    private _oauthURLSessionManagerService: OauthURLSessionManagerService
  ) {}

  ngOnInit(): void {
    this._togglzService
      .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
      .pipe(first())
      .subscribe((isOauthAuthorizationEnabled: boolean) => {
        this.isOauthAuthorizationTogglzEnable = isOauthAuthorizationEnabled
      })

    this._platform.get().subscribe((platform) => {
      this.isMobile = platform.columns4 || platform.columns8
    })

    this.token = this._route.snapshot.params.key

    this._route.data.subscribe((data) => {
      if (
        data.tokenVerification.errors.find(
          (x: string) => x === 'invalidPasswordResetToken'
        )
      ) {
        this.invalidPasswordResetToken = true
      }
      if (
        data.tokenVerification.errors.find(
          (x: string) => x === 'expiredPasswordResetToken'
        )
      ) {
        this.expiredPasswordResetToken = true
      }
      if (
        data.tokenVerification.errors.find(
          (x: string) => x === 'alreadyUsedPasswordResetToken'
        )
      ) {
        this.alreadyUsedPasswordResetToken = true
      }
    })

    this.form = this._fb.group({
      passwordGroup: [''],
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
    })
  }

  private buildPayload() {
    return {
      newPassword: this.form.value.passwordGroup.password,
      retypedPassword: this.form.value.passwordGroup.passwordConfirm,
      token: this.token,
      successRedirectLocation: null,
      twoFactorCode: this.form.value.twoFactorCode,
      twoFactorRecoveryCode: this.form.value.twoFactorRecoveryCode,
    }
  }

  private showAuthenticationChallenge(orcid: string): void {
    if (!this.outlet) return

    const portal = new ComponentPortal<AuthChallengeComponent>(
      AuthChallengeComponent
    )
    const componentRef = this.outlet.attachComponentPortal(portal)

    componentRef.instance.parentForm = this.form
    componentRef.instance.boldText = orcid
    componentRef.instance.trailingText = this.authChallengeTrailingText
    componentRef.instance.actionDescription = this.authChallengeLeadingText
    componentRef.instance.showPasswordField = false
    componentRef.instance.showTwoFactorField = true

    componentRef.instance.submitAttempt
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        const payload = this.buildPayload()

        this._accountRecoveryService.resetPasswordEmail(payload).subscribe({
          next: (response: any) => {
            if (response.successRedirectLocation || response.success) {
              this.successRedirect(response.successRedirectLocation)
            } else if (this.isPasswordPreviouslyUsed(response)) {
              // The code was right, but the new password is the current one,
              // which the registry only checks once 2FA has passed (PD-5692).
              // Back to the password form, which is where the fix is made. It
              // is rebuilt empty: its value accessor cannot take back the value
              // it emitted, and the password has to change anyway
              this.outlet.detach()
              this.showAuthChallenge = false
              this.form.patchValue({
                passwordGroup: null,
                twoFactorCode: null,
                twoFactorRecoveryCode: null,
              })
              this.showForm = true
              setTimeout(() => this.showPasswordPreviouslyUsed(response))
            } else {
              componentRef.instance.processBackendResponse(response)
            }
          },
          error: () => {
            componentRef.instance.loading = false
            this._snackBar.showValidationError()
          },
        })
      })

    componentRef.instance.cancelAttempt
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }

        this.form.reset()
        this._router.navigate([ApplicationRoutes.signin])
      })

    componentRef.changeDetectorRef.detectChanges()

    this.showForm = false
    this.showAuthChallenge = true
  }

  save() {
    if (this.form.valid) {
      this.loading = true
      const payload = this.buildPayload()

      this._accountRecoveryService
        .resetPasswordEmail(payload)
        .subscribe((value) => {
          this.loading = false

          if (value.successRedirectLocation) {
            this.successRedirect(value.successRedirectLocation)
          } else {
            // Check for specific backend errors
            if (value.errors?.length || value.newPassword?.errors?.length) {
              if (
                value.errors?.find(
                  (x: string) => x === 'invalidPasswordResetToken'
                )
              ) {
                this.invalidPasswordResetToken = true
              }
              if (
                value.errors?.find(
                  (x: string) => x === 'expiredPasswordResetToken'
                )
              ) {
                this.expiredPasswordResetToken = true
              }
              if (
                value.errors?.find(
                  (x: string) => x === 'alreadyUsedPasswordResetToken'
                )
              ) {
                this.alreadyUsedPasswordResetToken = true
              }
              if (
                value.newPassword?.errors?.find(
                  (x: string) =>
                    x === 'Pattern.registrationForm.password.containsEmail'
                )
              ) {
                this.passwordForm.form.get('password')?.setErrors({
                  passwordIsEqualToTheEmail: true,
                })
              }
              this.showPasswordPreviouslyUsed(value)
            } else if (value.twoFactorEnabled) {
              this.showAuthenticationChallenge(value.orcid)
            }
          }
        })
    } else {
      this.passwordForm.form.markAllAsTouched()
      this._snackBar.showValidationError()
    }
  }

  /**
   * Previous passwords cannot be reused (PD-5692): the registry answers with
   * this code when the new password is the current one.
   */
  private isPasswordPreviouslyUsed(value: any): boolean {
    return !!value?.newPassword?.errors?.find(
      (x: string) => x === 'Pattern.registrationForm.password.previouslyUsed'
    )
  }

  private showPasswordPreviouslyUsed(value: any): void {
    const password = this.passwordForm?.form?.get('password')
    if (!password || !this.isPasswordPreviouslyUsed(value)) {
      return
    }
    // Merged, not replaced: an emptied field keeps `required`, which the
    // requirements checklist reads to show nothing as met yet
    password.setErrors({
      ...(password.errors || {}),
      passwordPreviouslyUsed: true,
    })
    password.markAsTouched()
    // The page's own form reads the password form's status only when asked,
    // so ask: until the password changes, saving is refused here rather than
    // posted again for the registry to refuse
    this.form.get('passwordGroup')?.updateValueAndValidity()
    ;(
      this._window?.document?.getElementById('password-input') as HTMLElement
    )?.focus()
  }

  successRedirect(location: string) {
    const oauthURLFromSessionManager = this._oauthURLSessionManagerService.get()
    this.form.reset()

    if (
      !this.isOauthAuthorizationTogglzEnable &&
      isRedirectToTheAuthorizationPage({ url: location })
    ) {
      ;(this._window as any).outOfRouterNavigation(location)
    } else if (
      this.isOauthAuthorizationTogglzEnable &&
      oauthURLFromSessionManager
    ) {
      this._oauthURLSessionManagerService.clear()
      ;(this._window as any).outOfRouterNavigation(oauthURLFromSessionManager)
    } else {
      this._router.navigate([ApplicationRoutes.signin])
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
