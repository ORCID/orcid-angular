import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { first } from 'rxjs/operators'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { TwoFactor } from '../../../types/two-factor.endpoint'

export const clipboardTooltip: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 500,
  touchendHideDelay: 500,
}

@Component({
    selector: 'app-two-factor-enable',
    templateUrl: './two-factor-enable.component.html',
    styleUrls: [
        './two-factor-enable.component.scss',
        './two-factor-enable.component.scss-theme.scss',
    ],
    providers: [
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: clipboardTooltip },
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class TwoFactorEnableComponent implements OnInit {
  @Output() twoFactorEnabled = new EventEmitter<{
    backupCodes?: string
    backupCodesClipboard?: string
  }>()
  environment = runtimeEnvironment
  twoFactorForm: UntypedFormGroup
  showTextCode = false
  showBadVerificationCode = false
  loading = false

  constructor(private _twoFactorService: TwoFactorAuthenticationService) {}

  ngOnInit(): void {
    this.twoFactorForm = new UntypedFormGroup({
      verificationCode: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    })
  }

  onSubmit() {
    this.showBadVerificationCode = false

    if (this.twoFactorForm.invalid) {
      return
    }

    this.loading = true

    const twoFactor: TwoFactor = {
      verificationCode: this.twoFactorForm.get('verificationCode').value,
    }

    this._twoFactorService.register(twoFactor).subscribe((res) => {
      this.loading = false
      if (!res.valid) {
        this.showBadVerificationCode = true
      } else if (res.valid) {
        const backupCodes = res.backupCodes.join('\n')
        this.twoFactorEnabled.emit({
          backupCodes,
          backupCodesClipboard: res.backupCodes.join(' '),
        })
      }
    })
  }

  textCode() {
    this._twoFactorService
      .getTextCode()
      .pipe(first())
      .subscribe((result) => {
        this.showTextCode = true
        this.twoFactorForm.addControl(
          'textCode',
          new UntypedFormControl({ value: result.secret, disabled: true }, {})
        )
      })
  }
}
