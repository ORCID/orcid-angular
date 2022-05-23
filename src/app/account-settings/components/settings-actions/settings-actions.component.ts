import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-settings-actions',
  templateUrl: './settings-actions.component.html',
  styleUrls: ['./settings-actions.component.scss'],
})
export class SettingsActionsComponent implements OnInit {
  titleDownload = $localize`:@@account.downloadYourOrcid:Download your ORCID data`
  titleDuplicatedRecord = $localize`:@@account.removeDuplicate:Remove a duplicate record`
  titleDeactivate = $localize`:@@account.deactivateYourOrcidAccount:Deactivate your ORCID account`

  settingDownload = false
  settingDuplicatedRecord = false
  settingDeactivate = false

  settingDownloadLoading = false
  settingDuplicatedRecordLoading = false
  settingDeactivateLoading = false
  constructor(@Inject(WINDOW) private _window: Window) {}

  ngOnInit(): void {
    const hash = this._window.location.hash.substr(1)
    switch (hash) {
      case 'download-data':
        this.settingDownload = true
        break
      case 'deactivate-account':
        this.settingDeactivate = true
        break
      case 'remove-duplicate':
        this.settingDuplicatedRecord = true
        break
    }
  }
}
