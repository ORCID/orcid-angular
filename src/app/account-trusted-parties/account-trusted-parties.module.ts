import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'

import { AccountPanelModule } from '../cdk/account-panel/account-panel.module'
import { ModalModule } from '../cdk/modal/modal.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { TwoFactorAuthenticationFormModule } from '../cdk/two-factor-authentication-form/two-factor-authentication-form.module'
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service'
import { SharedModule } from '../shared/shared.module'
import { AccountTrustedPartiesRoutingModule } from './account-trusted-parties-routing.module'
import { DialogAddTrustedIndividualsComponent } from './components/dialog-add-trusted-individuals/dialog-add-trusted-individuals.component'
import { DialogRevokeTrustedIndividualsComponent } from './components/dialog-revoke-trusted-individuals/dialog-revoke-trusted-individuals.component'
import { DialogRevokeTrustedOrganizationComponent } from './components/dialog-revoke-trusted-organization/dialog-revoke-trusted-organization.component'
import { SettingsTrustedIndividualsSearchComponent } from './components/settings-trusted-individuals-search/settings-trusted-individuals-search.component'
import { SettingsTrustedIndividualsComponent } from './components/settings-trusted-individuals/settings-trusted-individuals.component'
import { SettingsTrustedOrganizationComponent } from './components/settings-trusted-organization/settings-trusted-organization.component'
import { SettingsTrustedOrganizationsComponent } from './components/settings-trusted-organizations/settings-trusted-organizations.component'
import { SettingsUsersThatThrustYouComponent } from './components/settings-users-that-thrust-you/settings-users-that-thrust-you.component'
import { SettingsComponent } from './components/settings/settings.component'
import { AccountTrustedPartiesComponent } from './pages/account-trusted-parties/account-trusted-parties.component'

@NgModule({
  declarations: [
    AccountTrustedPartiesComponent,
    SettingsComponent,
    AccountTrustedPartiesComponent,
    SettingsTrustedOrganizationsComponent,
    SettingsTrustedOrganizationComponent,
    DialogRevokeTrustedOrganizationComponent,
    SettingsTrustedIndividualsComponent,
    DialogRevokeTrustedIndividualsComponent,
    SettingsTrustedIndividualsSearchComponent,
    DialogAddTrustedIndividualsComponent,
    SettingsUsersThatThrustYouComponent,
  ],
  imports: [
    CommonModule,
    AccountTrustedPartiesRoutingModule,
    SideBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    SharedModule,
    MatMenuModule,
    MatRadioModule,
    MatTableModule,
    ModalModule,
    MatDividerModule,
    TextFieldModule,
    TwoFactorAuthenticationFormModule,
    AccountPanelModule,
  ],
  providers: [VerificationEmailModalService],
})
export class AccountTrustedPartiesModule {}
