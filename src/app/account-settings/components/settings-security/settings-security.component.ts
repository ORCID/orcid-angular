import { Component, OnInit } from '@angular/core'

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

  constructor() {}

  ngOnInit(): void {}
}
