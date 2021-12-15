import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SideBarModule } from '../cdk/side-bar/side-bar.module';
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { PanelExpandButtonsComponent } from './components/settings-panels-expand-buttons/settings-panels-expand-buttons.component';
import { SettingsPanelsComponent } from './components/settings-panels/settings-panels.component';
import { SettingsDefaultsComponent } from './components/settings-defaults/settings-defaults.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';

@NgModule({
  declarations: [
    AccountSettingsComponent,
    SettingsComponent,
    SettingsDefaultsComponent,
    SettingsPanelsComponent,
    PanelExpandButtonsComponent,
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
  ],
  providers: [VerificationEmailModalService],
})
export class AccountSettingsModule {}
