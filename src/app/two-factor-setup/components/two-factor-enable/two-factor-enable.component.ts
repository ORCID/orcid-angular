import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core'
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
import { RumJourneyEventService } from '../../../rum/service/customEvent.service'
import { AppEventName } from '../../../rum/app-event-names'

declare const runtimeEnvironment: any
declare const $localize: any

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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TwoFactorEnableComponent implements OnInit {
  @Output() twoFactorEnabled = new EventEmitter<{
    backupCodes?: string
    backupCodesClipboard?: string
  }>()
  environment = runtimeEnvironment
  twoFactorForm: UntypedFormGroup
  showTextCode = false
  loading = false
  textCodeTooltip = $localize`:@@account.copySetupCodeToClipboard:Copy setup code to clipboard`

  constructor(
    private _twoFactorService: TwoFactorAuthenticationService,
    private _observability: RumJourneyEventService
  ) {}

  ngOnInit(): void {
    this._observability.recordSimpleEvent(
      AppEventName.TwoFactorSetupStep1Loaded
    )

    this.twoFactorForm = new UntypedFormGroup({
      verificationCode: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    })
  }

  onSubmit() {
    const verificationCodeControl = this.twoFactorForm.get('verificationCode')
    if (verificationCodeControl?.hasError('invalidCode')) {
      const errors = { ...(verificationCodeControl.errors || {}) }
      delete errors.invalidCode
      verificationCodeControl.setErrors(
        Object.keys(errors).length ? errors : null
      )
    }

    if (this.twoFactorForm.invalid) {
      this.twoFactorForm.markAllAsTouched()
      return
    }

    this.loading = true

    const twoFactor: TwoFactor = {
      verificationCode: this.twoFactorForm.get('verificationCode')?.value,
    }

    this._twoFactorService.register(twoFactor).subscribe({
      next: (res) => {
        this.loading = false
        if (!res.valid) {
          verificationCodeControl?.setErrors({
            ...(verificationCodeControl.errors || {}),
            invalidCode: true,
          })
        } else if (res.valid) {
          const backupCodes = (res.backupCodes || []).join('\n')
          this.twoFactorEnabled.emit({
            backupCodes,
            backupCodesClipboard: (res.backupCodes || []).join(' '),
          })
        }
      },
      error: () => {
        this.loading = false
        verificationCodeControl?.setErrors({
          ...(verificationCodeControl.errors || {}),
          invalidCode: true,
        })
      },
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

  get textCodeClipboard() {
    return this.twoFactorForm.get('textCode')?.value || ''
  }
}
