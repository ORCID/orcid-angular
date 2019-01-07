import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatDividerModule,
  MatDivider,
  MatProgressSpinnerModule,
  MatProgressSpinner,
} from '@angular/material'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  imports: [CommonModule, MatDividerModule, MatProgressSpinnerModule],
  declarations: [],
  exports: [MatDivider, MatTooltipModule, MatProgressSpinner],
  providers: [], // Should not provide anything
})
export class SharedModule {}
