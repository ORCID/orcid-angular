import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { first } from 'rxjs/operators'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  mobile: boolean
  constructor(
    private dialogRef: MatDialogRef<any>,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this.mobile = platform.handset
      })
  }
}
