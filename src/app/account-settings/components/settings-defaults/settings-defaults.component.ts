import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-settings-defaults',
  templateUrl: './settings-defaults.component.html',
  styleUrls: ['./settings-defaults.component.scss'],
})
export class SettingsDefaultsComponent  {
  emailFrequencyLoading = false
  emailFrequencyExpanded = false
  languageFrequencyLoading = false
  visibilityFrequencyLoading = false
  visibilityExpanded = false
  titleEmailFrequency = $localize`:@@account.emailFrequency:Email frequency`
  titleLanguage = $localize`:@@account.language:Language`
  titleVisibility = $localize`:@@account.visibility:Visibility`

  constructor() {}

}
