import { preserveWhitespacesDefault } from '@angular/compiler'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import {
  HAS_NUMBER,
  HAS_LETTER_OR_SYMBOL,
  ApplicationRoutes,
} from 'src/app/constants'
import { AccountSecurityPasswordService } from 'src/app/core/account-security-password/account-security-password.service'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { OrcidValidators } from 'src/app/validators'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    './reset-password.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup
  hasNumberPatter = HAS_NUMBER
  hasLetterOrSymbolPatternn = HAS_LETTER_OR_SYMBOL
  labelInfo = $localize`:@@register.ariaLabelInfoPassword:info about password`

  @Output() loading = new EventEmitter<boolean>()
  errors: string[]
  success: boolean
  $destroy = new Subject()
  emailKey: string
  expiredPasswordResetToken: boolean
  invalidPasswordResetToken: boolean

  constructor(
    private _fb: FormBuilder,
    private _register: RegisterService,
    private _accountRecoveryService: PasswordRecoveryService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (!this._route.snapshot.params.key) {
      this._router.navigate([ApplicationRoutes.signin])
    } else {
      this.emailKey = this._route.snapshot.params.key
    }
    this.form = this._fb.group(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
            Validators.pattern(this.hasNumberPatter),
            Validators.pattern(this.hasLetterOrSymbolPatternn),
          ],
          asyncValidators: [this._register.backendValueValidate('password')],
        }),
        retypedPassword: new FormControl('', Validators.required),
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
            this.form.reset()
            this.success = true
            this._router.navigate([ApplicationRoutes.signin])
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
    }
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
