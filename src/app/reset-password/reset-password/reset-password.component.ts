import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router, UrlTree } from '@angular/router'
import { first, Subject } from 'rxjs'
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
import { OrcidValidators } from 'src/app/validators'

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
export class ResetPasswordComponent implements OnInit {
  form: UntypedFormGroup
  hasNumberPattern = HAS_NUMBER
  hasLetterOrSymbolPattern = HAS_LETTER_OR_SYMBOL
  labelInfo = $localize`:@@register.ariaLabelInfoPassword:info about password`

  @Output() loading = new EventEmitter<boolean>()
  errors: string[]
  $destroy = new Subject<void>()
  emailKey: string
  expiredPasswordResetToken: boolean
  invalidPasswordResetToken: boolean
  isMobile: boolean
  isOauthAuthorizationTogglzEnable: boolean

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
    if (!this._route.snapshot.params.key) {
      this._router.navigate([ApplicationRoutes.signin])
    } else {
      this.emailKey = this._route.snapshot.params.key
    }

    this._accountRecoveryService
      .resetPasswordEmailValidateToken({
        encryptedEmail: this.emailKey,
      })
      .subscribe((value) => {
        if (value.errors.find((x) => x === 'invalidPasswordResetToken')) {
          this.invalidPasswordResetToken = true
        }
        if (value.errors.find((x) => x === 'expiredPasswordResetToken')) {
          this.expiredPasswordResetToken = true
        }
      })

    this.form = this._fb.group(
      {
        password: new UntypedFormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
            Validators.pattern(this.hasNumberPattern),
            Validators.pattern(this.hasLetterOrSymbolPattern),
          ],
          asyncValidators: [this._register.backendValueValidate('password')],
        }),
        retypedPassword: new UntypedFormControl('', Validators.required),
      },
      {
        validators: OrcidValidators.matchValues('password', 'retypedPassword'),
      }
    )
  }

  save() {
    if (this.form.valid) {
      this.loading.emit(true)
      this._accountRecoveryService
        .resetPasswordEmail({
          password: { value: this.form.value.password },
          retypedPassword: { value: this.form.value.retypedPassword },
          encryptedEmail: this.emailKey,
          successRedirectLocation: null,
        })
        .subscribe((value) => {
          this.loading.emit(false)
          if (!value.errors.length && !value.password.errors.length) {
            const oauthURLFromSessionManager =
              this._oauthURLSessionManagerService.get()
            this.form.reset()
            if (
              !this.isOauthAuthorizationTogglzEnable &&
              isRedirectToTheAuthorizationPage({
                url: value.successRedirectLocation,
              })
            ) {
              this._window.location.href = value.successRedirectLocation
            } else if (
              this.isOauthAuthorizationTogglzEnable &&
              oauthURLFromSessionManager
            ) {
              this._oauthURLSessionManagerService.clear()
              this._window.location.href = oauthURLFromSessionManager
            } else {
              this._router.navigate([ApplicationRoutes.signin])
            }
          } else {
            if (value.errors.find((x) => x === 'invalidPasswordResetToken')) {
              this.invalidPasswordResetToken = true
            }
            if (value.errors.find((x) => x === 'expiredPasswordResetToken')) {
              this.expiredPasswordResetToken = true
            }
            if (
              value.password.errors.find(
                (x) => x === 'Pattern.registrationForm.password.containsEmail'
              )
            ) {
              this.form.controls.retypedPassword.setErrors({
                passwordIsEqualToTheEmail: true,
              })
            }
          }
        })
    } else {
      this.form.markAllAsTouched()
      this._snackBar.showValidationError()
    }
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
