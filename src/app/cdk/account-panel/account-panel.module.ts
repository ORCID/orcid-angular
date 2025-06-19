import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { SharedModule } from 'src/app/shared/shared.module'

import { SettingsPanelsDataComponent } from './settings-panels-data/settings-panels-data.component'
import { PanelExpandButtonsComponent } from './settings-panels-expand-buttons/settings-panels-expand-buttons.component'
import { SettingsPanelsComponent } from './settings-panels/settings-panels.component'
import { RouterModule, Routes } from '@angular/router'

@NgModule({
  declarations: [
    SettingsPanelsComponent,
    SettingsPanelsDataComponent,
    PanelExpandButtonsComponent,
  ],
  exports: [
    SettingsPanelsComponent,
    SettingsPanelsDataComponent,
    PanelExpandButtonsComponent,
    RouterModule,
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SharedModule,
    RouterModule,
  ],
})
export class AccountPanelModule {}
