import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfoPanelComponent } from './info-panel/info-panel.component'
import { MatIcon, MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [InfoPanelComponent],
  imports: [CommonModule, MatIconModule],
  exports: [InfoPanelComponent],
})
export class InfoPanelModule {}
