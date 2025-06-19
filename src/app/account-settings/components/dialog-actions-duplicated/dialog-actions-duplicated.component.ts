import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { DuplicateRemoveEndpoint } from 'src/app/types/account-actions-duplicated'
@Component({
  selector: 'app-dialog-actions-duplicated',
  templateUrl: './dialog-actions-duplicated.component.html',
  styleUrls: [
    './dialog-actions-duplicated.component.scss',
    './dialog-actions-duplicated.component.scss-theme.scss',
  ],
})
export class DialogActionsDuplicatedComponent implements OnInit {
  isMobile: boolean
  baseUrl = runtimeEnvironment.BASE_URL
  constructor(
    private matRef: MatDialogRef<DialogActionsDuplicatedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DuplicateRemoveEndpoint,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((platform) => {
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  ok() {
    this.matRef.close(this.data)
  }
  cancel() {
    this.matRef.close(null)
  }
}
