import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.scss'],
})
export class SettingsSecurityComponent implements OnInit {
  titleAccountPassword = $localize`:@@account.emailFrequency:Account password  `
  titleTwoFactor = $localize`:@@account.twoPassword:Two-factor authentication (ON)  `
  titleAlternativeSignin = $localize`:@@account.alternativeSignin:Alternate sign in accounts`

  settingSecurityPasswordOpen = false
  settingSecurityTwoFactor = false
  settingSecurityAlternateAccounts = false

  constructor() {}

  ngOnInit(): void {}
}
