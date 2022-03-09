import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

import { SettingsPanelsDataComponent } from './settings-panels-data/settings-panels-data.component'
import { PanelExpandButtonsComponent } from './settings-panels-expand-buttons/settings-panels-expand-buttons.component'
import { SettingsPanelsComponent } from './settings-panels/settings-panels.component'

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
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class AccountPanelModule {}
