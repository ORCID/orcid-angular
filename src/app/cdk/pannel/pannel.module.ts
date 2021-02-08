import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PanelComponent } from './panel/panel.component'
import { PanelElementComponent } from './panel-element/panel-element.component'
import { PanelPrivacyComponent } from './panel-privacy/panel-privacy.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialogModule } from '@angular/material/dialog'

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
