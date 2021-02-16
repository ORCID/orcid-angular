import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { PlatformInfo, PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: [
    './modal-header.component.scss',
    './modal-header.component.scss-theme.scss',
  ],
})
export class ModalHeaderComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>()
  platform: PlatformInfo

  constructor(
    private dialogReg: MatDialogRef<any>,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((platform) => {
      this.platform = platform
    })
  }

  closeEvent() {
    this.dialogReg.close()
    this.close.next()
  }
}
