import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { PanelElementComponent } from './panel-element/panel-element.component'
import { PanelPrivacyComponent } from './panel-privacy/panel-privacy.component'
import { PanelComponent } from './panel/panel.component'
import { PanelDataComponent } from './panel-data/panel-data.component'
import { PanelSourceComponent } from './panel-source/panel-source.component'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'
import { PanelsComponent } from './panels/panels.component'
import { PanelDataLineComponent } from './panel-data-line/panel-data-line.component'
import { PanelElementSourceComponent } from './panel-element-source/panel-element-source.component'
import { MatDividerModule } from '@angular/material/divider'
import { PanelExpandButtonsComponent } from './panel-expand-buttons/panel-expand-buttons.component'

@NgModule({
  declarations: [
    PanelComponent,
    PanelElementComponent,
    PanelPrivacyComponent,
    PanelDataComponent,
    PanelSourceComponent,
    PanelsComponent,
    PanelDataLineComponent,
    PanelElementSourceComponent,
    PanelExpandButtonsComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
  ],
  exports: [
    PanelComponent,
    PanelElementComponent,
    PanelPrivacyComponent,
    PanelDataComponent,
    PanelSourceComponent,
    A11yLinkModule,
    PanelsComponent,
    PanelDataLineComponent,
    PanelElementSourceComponent,
  ],
})
export class PanelModule {}
