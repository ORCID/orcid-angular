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

import { ModalModule } from '../cdk/modal/modal.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service'
import { SharedModule } from '../shared/shared.module'
import { AccountSettingsRoutingModule } from './account-settings-routing.module'
import { DialogSecurityAlternateAccountDeleteComponent } from './components/dialog-security-alternate-account-delete/dialog-security-alternate-account-delete.component'
import { SettingsDefaultsEmailFrequencyComponent } from './components/settings-defaults-email-frequency/settings-defaults-email-frequency.component'
import { SettingsDefaultsLanguageComponent } from './components/settings-defaults-language/settings-defaults-language.component'
import { SettingsDefaultsVisibilityComponent } from './components/settings-defaults-visibility/settings-defaults-visibility.component'
import { SettingsDefaultsComponent } from './components/settings-defaults/settings-defaults.component'
import { SettingsSecurityAlternateAccountsComponent } from './components/settings-security-alternate-accounts/settings-security-alternate-accounts.component'
import { SettingsSecurityAlternateSignInComponent } from './components/settings-security-alternate-sign-in/settings-security-alternate-sign-in.component'
import { SettingsSecurityPasswordComponent } from './components/settings-security-password/settings-security-password.component'
import { SettingsSecurityTwoFactorAuthComponent } from './components/settings-security-two-factor-auth/settings-security-two-factor-auth.component'
import { SettingsSecurityComponent } from './components/settings-security/settings-security.component'
import { SettingsComponent } from './components/settings/settings.component'
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component'
import { SettingsPanelsDataComponent } from './panels/settings-panels-data/settings-panels-data.component'
import { PanelExpandButtonsComponent } from './panels/settings-panels-expand-buttons/settings-panels-expand-buttons.component'
import { SettingsPanelsComponent } from './panels/settings-panels/settings-panels.component'

@NgModule({
  declarations: [
    AccountSettingsComponent,
    SettingsComponent,
    SettingsDefaultsComponent,
    SettingsPanelsComponent,
    PanelExpandButtonsComponent,
    SettingsPanelsDataComponent,
    SettingsDefaultsEmailFrequencyComponent,
    SettingsDefaultsLanguageComponent,
    SettingsDefaultsVisibilityComponent,
    SettingsSecurityComponent,
    SettingsSecurityPasswordComponent,
    SettingsSecurityTwoFactorAuthComponent,
    SettingsSecurityAlternateSignInComponent,
    DialogSecurityAlternateAccountDeleteComponent,
    SettingsSecurityAlternateAccountsComponent,
    SettingsSecurityTwoFactorAuthComponent,
  ],
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
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
  ],
  providers: [VerificationEmailModalService],
})
export class AccountSettingsModule {}
