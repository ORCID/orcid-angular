import { Component, Inject, OnInit } from '@angular/core'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountTrustedIndividualsService } from 'src/app/core/account-trusted-individuals/account-trusted-individuals.service'
import { AccountTrustedIndividual } from 'src/app/types/account-trusted-individuals'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-dialog-revoke-trusted-individuals',
  templateUrl: './dialog-revoke-trusted-individuals.component.html',
  styleUrls: ['./dialog-revoke-trusted-individuals.component.scss'],
})
export class DialogRevokeTrustedIndividualsComponent implements OnInit {
  isMobile: boolean
  baseUrl = environment.BASE_URL
  constructor(
    private matRef: MatDialogRef<DialogRevokeTrustedIndividualsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountTrustedIndividual,
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
