import { Component, OnInit } from '@angular/core'

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
  constructor() {}

  ngOnInit(): void {}
}
