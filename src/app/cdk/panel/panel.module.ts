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
import { PanelDetailsComponent } from './panel-details/panel-details.component'
import { PanelSourceComponent } from './panel-source/panel-source.component'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'

@NgModule({
  declarations: [
    PanelComponent,
    PanelElementComponent,
    PanelPrivacyComponent,
    PanelDataComponent,
    PanelDetailsComponent,
    PanelSourceComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  exports: [
    PanelComponent,
    PanelElementComponent,
    PanelPrivacyComponent,
    PanelDataComponent,
    PanelDetailsComponent,
    PanelSourceComponent,
    A11yLinkModule
  ],
})
export class PanelModule {}
