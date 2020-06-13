import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TrustedIndividualsDropdownComponent } from './trusted-individuals-dropdown.component'
import { MatMenuModule } from '@angular/material/menu'

@NgModule({
  declarations: [TrustedIndividualsDropdownComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [TrustedIndividualsDropdownComponent],
})
export class TrustedIndividualsDropdownModule {}
