import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { AccountActionsDownloadService } from 'src/app/core/account-actions-download/account-actions-download.service'

@Component({
  selector: 'app-settings-actions-download',
  templateUrl: './settings-actions-download.component.html',
  styleUrls: ['./settings-actions-download.component.scss'],
})
export class SettingsActionsDownloadComponent  {
  @Output() loading = new EventEmitter<boolean>()

  constructor(private _accountDownloadService: AccountActionsDownloadService) {}

  createDownload() {
    this.loading.emit(true)
    this._accountDownloadService.downloadUserData().subscribe(() => {
      this.loading.emit(false)
    })
  }
}
