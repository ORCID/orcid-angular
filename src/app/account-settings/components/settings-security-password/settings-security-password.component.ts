import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HAS_NUMBER, HAS_LETTER_OR_SYMBOL } from 'src/app/constants'
import { AccountSecurityPasswordService } from 'src/app/core/account-security-password/account-security-password.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { OrcidValidators } from 'src/app/validators'

@Component({
  selector: 'app-settings-security-password',
  templateUrl: './settings-security-password.component.html',
  styleUrls: [
    './settings-security-password.component.scss',
    './settings-security-password.component.scss-theme.scss',
  ],
})
export class SettingsSecurityPasswordComponent implements OnInit {
  form: FormGroup
  hasNumberPatter = HAS_NUMBER
  hasLetterOrSymbolPatter = HAS_LETTER_OR_SYMBOL
  constructor(
    private _fb: FormBuilder,
    private _register: RegisterService,
    private _accountPassword: AccountSecurityPasswordService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group(
      {
        oldPassword: [Validators.required],
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.hasNumberPatter),
            Validators.pattern(this.hasLetterOrSymbolPatter),
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
      this._accountPassword.updatePassword(this.form.value).subscribe()
    }
  }
}
