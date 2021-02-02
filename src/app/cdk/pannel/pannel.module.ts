import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { PanelElementComponent } from './panel-element/panel-element.component'
import { PanelPrivacyComponent } from './panel-privacy/panel-privacy.component'
import { PanelComponent } from './panel/panel.component'

@NgModule({
  declarations: [PanelComponent, PanelElementComponent, PanelPrivacyComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  exports: [PanelComponent, PanelElementComponent, PanelPrivacyComponent],
})
export class PannelModule {}
