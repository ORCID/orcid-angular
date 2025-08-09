import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { AccountActionsDownloadService } from 'src/app/core/account-actions-download/account-actions-download.service'

@Component({
  selector: 'app-settings-actions-download',
  templateUrl: './settings-actions-download.component.html',
  styleUrls: ['./settings-actions-download.component.scss'],
  standalone: false,
})
export class SettingsActionsDownloadComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>()

  constructor(private _accountDownloadService: AccountActionsDownloadService) {}

  ngOnInit(): void {}

  createDownload() {
    this.loading.emit(true)
    this._accountDownloadService.downloadUserData().subscribe(() => {
      this.loading.emit(false)
    })
  }
}
