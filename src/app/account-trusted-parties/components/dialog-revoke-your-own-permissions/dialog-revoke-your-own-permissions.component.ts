import { Component, Inject, OnInit } from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { Delegator } from 'src/app/types/trusted-individuals.endpoint'

@Component({
  selector: 'app-dialog-revoke-your-own-permissions',
  templateUrl: './dialog-revoke-your-own-permissions.component.html',
  styleUrls: ['./dialog-revoke-your-own-permissions.component.scss'],
})
export class DialogRevokeYourOwnPermissionsComponent implements OnInit {
  isMobile: boolean
  baseUrl = runtimeEnvironment.BASE_URL
  constructor(
    private matRef: MatDialogRef<DialogRevokeYourOwnPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Delegator,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((platform) => {
      this.isMobile = platform.columns4 || platform.columns8
    })
  }
  cancel() {
    this.matRef.close()
  }
  ok() {
    this.matRef.close(this.data)
  }
}
