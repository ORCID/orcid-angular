import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SideBarModule } from '../cdk/side-bar/side-bar.module';
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service';
import { SharedModule, SharedModule } from '../shared/shared.module';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import {
  SettingsDefaultsEmailFrequencyComponent,
  SettingsDefaultsEmailFrequencyComponent,
} from './components/settings-defaults-email-frequency/settings-defaults-email-frequency.component';
import {
  SettingsDefaultsLanguageComponent,
} from './components/settings-defaults-language/settings-defaults-language.component';
import {
  SettingsDefaultsComponent,
  SettingsDefaultsComponent,
} from './components/settings-defaults/settings-defaults.component';
import { SettingsComponent, SettingsComponent } from './components/settings/settings.component';
import { AccountSettingsComponent, AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import {
  SettingsPanelsDataComponent,
  SettingsPanelsDataComponent,
} from './panels/settings-panels-data/settings-panels-data.component';
import {
  PanelExpandButtonsComponent,
  PanelExpandButtonsComponent,
} from './panels/settings-panels-expand-buttons/settings-panels-expand-buttons.component';
import { SettingsPanelsComponent, SettingsPanelsComponent } from './panels/settings-panels/settings-panels.component';

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
  ],
  providers: [VerificationEmailModalService],
})
export class AccountSettingsModule {}
