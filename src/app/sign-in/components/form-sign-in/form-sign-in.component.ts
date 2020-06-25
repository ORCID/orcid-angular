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
import { Router } from '@angular/router'
import { SingInLocal, TypeSignIn } from '../../../types/sing-in.local'

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
  singInLocal = {} as SingInLocal
  username: string

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
    @Inject(WINDOW) private window: Window,
    private _signIn: SignInService,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus()
  }

  onSubmit() {
    this.singInLocal.data = this.authorizationForm.getRawValue()
    this.singInLocal.type = this.signInType

    this.authorizationForm.markAllAsTouched()

    if (this.authorizationForm.valid) {
      this.hideErrors()
      this.loading = true

      const $signIn = this._signIn.signIn(this.singInLocal)
      $signIn.subscribe((data) => {
        this.loading = false
        this.printError = false
        if (data.success) {
          this.navigateTo(data.url)
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
    if (this.singInLocal.type === TypeSignIn.institutional) {
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

  updateUsername(email) {
    this.authorizationForm.patchValue({
      username: email,
    })
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
