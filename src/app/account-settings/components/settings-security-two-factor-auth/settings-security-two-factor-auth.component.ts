import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-settings-security-two-factor-auth',
  templateUrl: './settings-security-two-factor-auth.component.html',
  styleUrls: [
    './settings-security-two-factor-auth.component.scss',
    './settings-security-two-factor-auth.component.scss-theme.scss',
  ],
})
export class SettingsSecurityTwoFactorAuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  disable() {
    this.twoFactorAuthenticationService
      .disable()
      .pipe(first())
      .subscribe((result) => {
        this.loading.next(false)
        if (!result.enabled) {
          this.twoFactorState = result.enabled
          this.twoFactorStateOutput.emit(false)
        }
      })
  }

  twoFactor() {
    if (!this.twoFactorState) {
      this._router.navigate([ApplicationRoutes.twoFactorSetup])
    } else {
      this.loading.next(true)
      this.disable()
    }
  }
}
