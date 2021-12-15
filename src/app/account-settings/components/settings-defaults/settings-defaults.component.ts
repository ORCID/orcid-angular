import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-settings-defaults',
  templateUrl: './settings-defaults.component.html',
  styleUrls: ['./settings-defaults.component.scss'],
})
export class SettingsDefaultsComponent implements OnInit {
  loading = false
  titleEmailFrequency = $localize`:@@account.emailFrequency:Email frequency`
  constructor() {}

  ngOnInit(): void {}
}
