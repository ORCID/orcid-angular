import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { OauthService } from '../../../core/oauth/oauth.service'
import { TwoFactor } from '../../../types/two-factor.endpoint'
import { WINDOW } from '../../../cdk/window'

@Component({
  selector: 'app-two-factor-module',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss'],
  preserveWhitespaces: true,
})
export class TwoFactorComponent implements OnInit {
  loading = false
  showBadVerificationCode = false
  showBadRecoveryCode = false
  twoFactorForm: FormGroup
  labelInfo = $localize`:@@twoFactor.ariaLabelInfoTwoFactor:info about two factor authentication`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _oauthService: OauthService
  ) {}

  ngOnInit(): void {
    this.twoFactorForm = new FormGroup({
      verificationCode: new FormControl(),
      recoveryCode: new FormControl(),
    })
  }

  authenticate($event) {
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

    this._oauthService.submitCode(twoFactor).subscribe(
      (res) => {
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
      },
      (error) => console.log(error)
    )
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
