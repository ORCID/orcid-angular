import { Component, Inject, OnInit } from '@angular/core'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { first } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'

@Component({
    selector: 'app-settings-security',
    templateUrl: './settings-security.component.html',
    styleUrls: ['./settings-security.component.scss'],
    standalone: false
})
export class SettingsSecurityComponent implements OnInit {
  titleAccountPassword = $localize`:@@account.accountPassword:Account password`
  titleTwoFactor = $localize`:@@account.twoPassword:Two-factor authentication`
  titleAlternativeSignin = $localize`:@@account.alternativeSignin:Alternate sign in accounts`

  settingSecurityPasswordOpen = false
  settingSecurityTwoFactor = false
  settingSecurityAlternateAccounts = false

  settingSecurityPasswordLoading = false
  settingSecurityTwoFactorLoading = false
  settingSecurityAlternateAccountsLoading = false

  twoFactorState = false

  constructor(
    private twoFactorAuthenticationService: TwoFactorAuthenticationService,
    @Inject(WINDOW) private _window: Window
  ) {}

  ngOnInit(): void {
    this.twoFactorAuthenticationService
      .checkState()
      .pipe(first())
      .subscribe((result) => {
        this.twoFactorState = result.enabled
      })
    const hash = this._window.location.hash.substr(1)
    switch (hash) {
      case 'password':
        this.settingSecurityPasswordOpen = true
        break
      case '2FA':
        this.settingSecurityTwoFactor = true
        break
      case 'alternate-signin':
        this.settingSecurityAlternateAccounts = true
        break
    }
  }

  twoFactorStateChanges($event) {
    this.twoFactorState = $event
  }
}
