import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { AccountTrustedOrganizationsService } from 'src/app/core/account-trusted-organizations/account-trusted-organizations.service'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'
import { DialogRevokeTrustedOrganizationComponent } from '../dialog-revoke-trusted-organization/dialog-revoke-trusted-organization.component'

@Component({
  selector: 'app-settings-trusted-organizations',
  templateUrl: './settings-trusted-organizations.component.html',
  styleUrls: ['./settings-trusted-organizations.component.scss'],
})
export class SettingsTrustedOrganizationsComponent implements OnInit {
  $trustedOrganization: Observable<AccountTrustedOrganization[]>
  trustedPartiesUrl = '/trusted-parties'
  constructor(
    private _trustedOrganizationService: AccountTrustedOrganizationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.$trustedOrganization = this._trustedOrganizationService.get()
  }

  revokeAccess(accountTrustedOrganization: AccountTrustedOrganization) {
    this.dialog
      .open(DialogRevokeTrustedOrganizationComponent, {
        data: accountTrustedOrganization,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this._trustedOrganizationService.delete(value).subscribe(() => {
            this.$trustedOrganization = this._trustedOrganizationService.get()
          })
        }
      })
  }
}
