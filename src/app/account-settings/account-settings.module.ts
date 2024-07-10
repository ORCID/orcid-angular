import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core'
import { MatDividerModule } from '@angular/material/divider'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { AccountPanelModule } from '../cdk/account-panel/account-panel.module'
import { ModalModule } from '../cdk/modal/modal.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { TopBarMyPublicRecordPreviewModule } from '../cdk/top-bar-my-public-record-preview/top-bar-my-public-record-preview.module'
import { TwoFactorAuthenticationFormModule } from '../cdk/two-factor-authentication-form/two-factor-authentication-form.module'
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service'
import { SharedModule } from '../shared/shared.module'
import { AccountSettingsRoutingModule } from './account-settings-routing.module'
import { DialogActionsDuplicatedMergedConfirmedComponent } from './components/dialog-actions-duplicated-merged-confirmed/dialog-actions-duplicated-merged-confirmed.component'
import { DialogActionsDuplicatedTwoFactorAuthComponent } from './components/dialog-actions-duplicated-two-factor-auth/dialog-actions-duplicated-two-factor-auth.component'
import { DialogActionsDuplicatedComponent } from './components/dialog-actions-duplicated/dialog-actions-duplicated.component'
import { DialogSecurityAlternateAccountDeleteComponent } from './components/dialog-security-alternate-account-delete/dialog-security-alternate-account-delete.component'
import { SettingsActionsDeactivateComponent } from './components/settings-actions-deactivate/settings-actions-deactivate.component'
import { SettingsActionsDownloadComponent } from './components/settings-actions-download/settings-actions-download.component'
import { SettingsActionsDuplicatedComponent } from './components/settings-actions-duplicated/settings-actions-duplicated.component'
import { SettingsActionsComponent } from './components/settings-actions/settings-actions.component'
import { SettingsDefaultsEmailFrequencyComponent } from './components/settings-defaults-email-frequency/settings-defaults-email-frequency.component'
import { SettingsDefaultsLanguageComponent } from './components/settings-defaults-language/settings-defaults-language.component'
import { SettingsDefaultsVisibilityComponent } from './components/settings-defaults-visibility/settings-defaults-visibility.component'
import { SettingsDefaultsComponent } from './components/settings-defaults/settings-defaults.component'
import { SettingsSecurityAlternateSignInComponent } from './components/settings-security-alternate-sign-in/settings-security-alternate-sign-in.component'
import { SettingsSecurityPasswordComponent } from './components/settings-security-password/settings-security-password.component'
import { SettingsSecurityTwoFactorAuthComponent } from './components/settings-security-two-factor-auth/settings-security-two-factor-auth.component'
import { SettingsSecurityComponent } from './components/settings-security/settings-security.component'
import { SettingsSharingHtmlCodeComponent } from './components/settings-sharing-html-code/settings-sharing-html-code.component'
import { SettingsSharingQrCodeComponent } from './components/settings-sharing-qr-code/settings-sharing-qr-code.component'
import { SettingsSharingComponent } from './components/settings-sharing/settings-sharing.component'
import { SettingsComponent } from './components/settings/settings.component'
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'


@NgModule({
  declarations: [
    AccountSettingsComponent,
    SettingsComponent,
    SettingsDefaultsComponent,
    SettingsDefaultsEmailFrequencyComponent,
    SettingsDefaultsLanguageComponent,
    SettingsDefaultsVisibilityComponent,
    SettingsSecurityComponent,
    SettingsSecurityPasswordComponent,
    SettingsSecurityTwoFactorAuthComponent,
    SettingsSecurityAlternateSignInComponent,
    DialogSecurityAlternateAccountDeleteComponent,
    SettingsSecurityTwoFactorAuthComponent,
    SettingsActionsComponent,
    SettingsActionsDownloadComponent,
    SettingsActionsDeactivateComponent,
    SettingsActionsDuplicatedComponent,
    DialogActionsDuplicatedComponent,
    DialogActionsDuplicatedMergedConfirmedComponent,
    DialogActionsDuplicatedTwoFactorAuthComponent,
    SettingsSharingComponent,
    SettingsSharingQrCodeComponent,
    SettingsSharingHtmlCodeComponent,
    
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
    TextFieldModule,
    TwoFactorAuthenticationFormModule,
    AccountPanelModule,
    TopBarMyPublicRecordPreviewModule,
  ],
  providers: [VerificationEmailModalService],
})
export class AccountSettingsModule {}
