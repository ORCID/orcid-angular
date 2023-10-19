import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TrustedIndividualsDropdownComponent } from './trusted-individuals-dropdown.component'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'

@NgModule({
  declarations: [TrustedIndividualsDropdownComponent],
  imports: [CommonModule, MatMenuModule, A11yLinkModule],
  exports: [TrustedIndividualsDropdownComponent],
})
export class TrustedIndividualsDropdownModule {}
