import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfoDropDownComponent } from './info-drop-down.component'
import { MatIconModule } from '@angular/material/icon'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'

@NgModule({
  declarations: [InfoDropDownComponent],
  imports: [CommonModule, MatIconModule, A11yLinkModule],
  exports: [InfoDropDownComponent],
})
export class InfoDropDownModule {}
