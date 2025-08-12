import { Component, Input, OnInit } from '@angular/core'
import { AccountTrustedOrganizationsService } from 'src/app/core/account-trusted-organizations/account-trusted-organizations.service'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'

@Component({
  selector: 'app-settings-trusted-organization',
  templateUrl: './settings-trusted-organization.component.html',
  styleUrls: ['./settings-trusted-organization.component.scss'],
  standalone: false,
})
export class SettingsTrustedOrganizationComponent implements OnInit {
  @Input() trustedOrganization: AccountTrustedOrganization
  constructor() {}

  ngOnInit(): void {}
}
