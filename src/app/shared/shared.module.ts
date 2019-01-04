import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatDividerModule, MatDivider } from '@angular/material'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  imports: [CommonModule, MatDividerModule],
  declarations: [],
  exports: [MatDivider, MatTooltipModule],
  providers: [], // Should not provide anything
})
export class SharedModule {}
