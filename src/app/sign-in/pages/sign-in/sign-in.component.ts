import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { UserService } from '../../../core'
import { environment } from 'src/environments/environment'
import { TwoFactorComponent } from '../../components/two-factor/two-factor.component'
import { take } from 'rxjs/operators'

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

  constructor(
    private _signIn: SignInService,
    private _userInfo: UserService,
    @Inject(WINDOW) private window: Window
  ) {
    _userInfo
      .getUserStatus()
      .pipe(take(1))
      .subscribe(data => {
        if (data) {
          this.isLoggedIn = data
          _userInfo
            .getUserInfoOnEachStatusUpdate()
            .pipe(take(1))
            .subscribe(info => {
              this.displayName = info.displayName
              this.realUserOrcid =
                environment.BASE_URL + info.userInfo.REAL_USER_ORCID
            })
        }
      })
  }

  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      '(\\d{4}-){3}\\d{3}[\\dX]' +
        '|^.*\\.([a-zA-Z\\-])([a-zA-Z\\-]{0,61})([a-zA-Z\\-])$'
    ),
  ])
  passwordFormControl = new FormControl('', [Validators.required])

  authorizationForm = new FormGroup({
    username: this.usernameFormControl,
    password: this.passwordFormControl,
    recoveryCode: new FormControl(),
    verificationCode: new FormControl(),
  })

  ngOnInit() {}

  onSubmit() {
    const value = this.authorizationForm.getRawValue()

    this.authorizationForm.markAllAsTouched()

    if (this.authorizationForm.valid) {
      this.loading = true
      if (this.show2FA) {
        this.showBadVerificationCode = false
        this.showBadRecoveryCode = false
      }

      const $signIn = this._signIn.signIn(value)
      $signIn.subscribe(data => {
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

  navigateTo(val) {
    this.window.location.href = val
  }
}
