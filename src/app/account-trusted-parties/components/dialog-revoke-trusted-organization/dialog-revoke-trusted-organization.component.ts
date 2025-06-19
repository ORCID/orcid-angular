import { Component, Inject, OnInit } from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'

@Component({
  selector: 'app-dialog-revoke-trusted-organization',
  templateUrl: './dialog-revoke-trusted-organization.component.html',
  styleUrls: [
    './dialog-revoke-trusted-organization.component.scss',
    './dialog-revoke-trusted-organization.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class DialogRevokeTrustedOrganizationComponent implements OnInit {
  isMobile: boolean
  constructor(
    private matRef: MatDialogRef<DialogRevokeTrustedOrganizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountTrustedOrganization,
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
