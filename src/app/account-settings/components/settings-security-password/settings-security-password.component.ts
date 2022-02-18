import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { HAS_LETTER_OR_SYMBOL, HAS_NUMBER } from 'src/app/constants'
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
export class SettingsSecurityPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup
  hasNumberPatter = HAS_NUMBER
  hasLetterOrSymbolPatter = HAS_LETTER_OR_SYMBOL
  @Output() loading = new EventEmitter<boolean>()
  errors: string[]
  success: boolean
  $destroy = new Subject()

  constructor(
    private _fb: FormBuilder,
    private _register: RegisterService,
    private _accountPassword: AccountSecurityPasswordService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group(
      {
        oldPassword: ['', Validators.required],
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
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
    this.form.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
      this.errors = []
    })
  }

  save() {
    if (this.form.valid) {
      this.loading.emit(true)
      this._accountPassword
        .updatePassword(this.form.value)
        .subscribe((value) => {
          this.loading.emit(false)

          if (!value.password) {
            this.errors = []
            this.form.reset()
            this.success = true
          } else {
            this.success = false
            this.errors = value.errors
          }
        })
    }
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
  cancel() {
    this.form.reset()
  }
}
