import { Component, OnInit } from '@angular/core'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.scss'],
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

  constructor(private twoFactorAuthenticationService: TwoFactorAuthenticationService) {}

  ngOnInit(): void {
    this.twoFactorAuthenticationService.checkState()
      .pipe(first())
      .subscribe((result) => {
        this.twoFactorState = result.enabled
      })
  }

  twoFactorStateChanges($event) {
    this.twoFactorState = $event
  }
}
