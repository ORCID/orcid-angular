import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-settings-defaults',
  templateUrl: './settings-defaults.component.html',
  styleUrls: ['./settings-defaults.component.scss'],
})
export class SettingsDefaultsComponent implements OnInit {
  emailFrequencyLoading = false
  emailFrequencyExpanded = false
  languageFrequencyLoading = false
  visibilityFrequencyLoading = false
  visibilityExpanded = false
  languageExpanded = false
  titleEmailFrequency = $localize`:@@account.emailFrequency:Notification email frequency`
  titleLanguage = $localize`:@@account.language:Language`
  titleVisibility = $localize`:@@account.visibility:Visibility`

  constructor(@Inject(WINDOW) private _window: Window) {}

  ngOnInit(): void {
    const hash = this._window.location.hash.substr(1)
    switch (hash) {
      case 'email-frequency':
        this.emailFrequencyExpanded = true
        break
      case 'language':
        this.languageExpanded = true
        break
      case 'visibility':
        this.visibilityExpanded = true
        break
    }
  }
}
