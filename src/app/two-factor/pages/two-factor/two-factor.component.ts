import { Component, Inject, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { TwoFactor } from '../../../types/two-factor.endpoint'
import { WINDOW } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { first } from 'rxjs/operators'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'

@Component({
  selector: 'app-two-factor-module',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class TwoFactorComponent implements OnInit {
  loading = false
  showBadVerificationCode = false
  showBadRecoveryCode = false
  twoFactorForm: UntypedFormGroup
  labelInfo = $localize`:@@twoFactor.ariaLabelInfoTwoFactor:info about two factor authentication`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private _platformInfo: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this.twoFactorForm = new UntypedFormGroup({
      verificationCode: new UntypedFormControl(),
      recoveryCode: new UntypedFormControl(),
    })
  }

  authenticate($event) {
    this.resetTwoFactor()
    if ($event.recoveryCode) {
      this.twoFactorForm.patchValue({
        recoveryCode: $event.recoveryCode,
      })
      this.onSubmit()
    } else if ($event.verificationCode) {
      this.twoFactorForm.patchValue({
        verificationCode: $event.verificationCode,
      })
      this.onSubmit()
    }
  }

  onSubmit() {
    this.showBadVerificationCode = false
    this.showBadRecoveryCode = false

    if (this.twoFactorForm.invalid) {
      return
    }

    this.loading = true

    const twoFactor: TwoFactor = {
      verificationCode: this.twoFactorForm.get('verificationCode').value,
      recoveryCode: this.twoFactorForm.get('recoveryCode').value,
      redirectUrl: undefined,
      errors: undefined,
    }

    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._twoFactorAuthenticationService
          .submitCode(twoFactor, platform.queryParameters.social)
          .subscribe((res) => {
            this.loading = false
            if (res.errors && res.errors.length > 0) {
              if (res.errors[0].includes('verification')) {
                this.showBadVerificationCode = true
              } else {
                this.showBadRecoveryCode = true
              }
            } else if (res.redirectUrl) {
              this.navigateTo(res.redirectUrl)
            }
          })
      })
  }

  resetTwoFactor() {
    this.twoFactorForm.patchValue({
      verificationCode: '',
    })
    this.twoFactorForm.patchValue({
      recoveryCode: '',
    })
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
