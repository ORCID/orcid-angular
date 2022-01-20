import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service'
import { AccountSettingsRoutingModule } from './account-settings-routing.module'
import { SettingsPanelsComponent } from './panels/settings-panels/settings-panels.component'
import { SettingsDefaultsComponent } from './components/settings-defaults/settings-defaults.component'
import { SettingsComponent } from './components/settings/settings.component'
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { SettingsPanelsDataComponent } from './panels/settings-panels-data/settings-panels-data.component'
import { PanelExpandButtonsComponent } from './panels/settings-panels-expand-buttons/settings-panels-expand-buttons.component'
import { SettingsDefaultsEmailFrequencyComponent } from './components/settings-defaults-email-frequency/settings-defaults-email-frequency.component'
import { MatOptionModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [
    AccountSettingsComponent,
    SettingsComponent,
    SettingsDefaultsComponent,
    SettingsPanelsComponent,
    PanelExpandButtonsComponent,
    SettingsPanelsDataComponent,
    SettingsDefaultsEmailFrequencyComponent,
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
  ],
  providers: [VerificationEmailModalService],
})
export class AccountSettingsModule {}
