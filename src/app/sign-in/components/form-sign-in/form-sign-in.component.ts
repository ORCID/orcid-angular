import {
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
import { UsernameValidator } from '../../../shared/validators/username/username.validator'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { TwoFactorComponent } from '../two-factor/two-factor.component'
import { ShibbolethSignInData } from '../../../types/shibboleth-sign-in-data'
import { ActivatedRoute, Router } from '@angular/router'
import { SignInLocal, TypeSignIn } from '../../../types/sign-in.local'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { DeclareOauthSession } from '../../../types/declareOauthSession.endpoint'
import { OauthService } from '../../../core/oauth/oauth.service'

@Component({
  selector: 'app-form-sign-in',
  templateUrl: './form-sign-in.component.html',
  styleUrls: ['./form-sign-in.component.scss'],
  providers: [TwoFactorComponent],
  preserveWhitespaces: true,
})
export class FormSignInComponent implements OnInit {
  @ViewChild('firstInput') firstInput: ElementRef
  @Input() signInType: TypeSignIn
  @Input() shibbolethSignInData: ShibbolethSignInData
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
  email: string
  orcidPrimaryDeprecated: string
  signInLocal = {} as SignInLocal

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

  constructor(
    _platformInfo: PlatformInfoService,
    _route: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
    private _signIn: SignInService,
    private _oauthService: OauthService,
    private _router: Router
  ) {
    this.signInLocal.type = this.signInType
    _platformInfo.get().subscribe((platform) => {
      if (platform.oauthMode) {
        this.signInLocal.type = TypeSignIn.oauth
        _route.queryParams.subscribe((params) => {
          this.signInLocal.params = {} as DeclareOauthSession
          this.signInLocal.params.client_id = params['client_id']
          this.signInLocal.params.response_type = params['response_type']
          this.signInLocal.params.scope = params['scope']
          this.signInLocal.params.redirect_uri = params['redirect_uri']
        })
      }
    })

    _route.queryParams.subscribe((params) => {
      if (params['oauth'] === '') {
        this.signInLocal.type = TypeSignIn.oauth
        this.signInLocal.params = {} as DeclareOauthSession
        this.signInLocal.params.client_id = params['client_id']
        this.signInLocal.params.response_type = params['response_type']
        this.signInLocal.params.scope = params['scope']
        this.signInLocal.params.redirect_uri = params['redirect_uri']
      }
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus()
  }

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
          if (data.url.toLowerCase().includes('oauth/authorize')) {
            this.oauthAuthorize(this.signInLocal.params)
          } else {
            this.navigateTo(data.url)
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
    if (this.signInLocal.type === TypeSignIn.institutional) {
      this._router.navigate([
        '/register',
        {
          linkRequest: this.shibbolethSignInData.linkType,
          emailId: this.shibbolethSignInData.emailEncoded,
          firstName: this.shibbolethSignInData.firstNameEncoded,
          lastName: this.shibbolethSignInData.lastNameEncoded,
          providerId: this.shibbolethSignInData.providerIdEncoded,
          accountId: this.shibbolethSignInData.accountIdEncoded,
        },
      ])
    } else {
      this._router.navigate(['/register'])
    }
  }

  oauthAuthorize(value: DeclareOauthSession) {
    this._oauthService.oauthAuthorize(value).subscribe((requestInfoForm) => {
      this._oauthService.updateRequestInfoFormInMemory(requestInfoForm)
      this._router.navigate(['/oauth/authorize'], {
        queryParams: {
          client_id: this.signInLocal.params.client_id,
          response_type: this.signInLocal.params.response_type,
          scope: this.signInLocal.params.scope,
          redirect_uri: this.signInLocal.params.redirect_uri,
        },
      })
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
