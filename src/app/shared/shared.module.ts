import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import {
  MatDividerModule,
  MatDivider,
  MatProgressSpinnerModule,
  MatProgressSpinner,
  MatExpansionModule,
  MatFormFieldModule,
} from '@angular/material'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  declarations: [],
  exports: [
    MatDivider,
    MatTooltipModule,
    MatProgressSpinner,
    MatExpansionModule,
  ],
  providers: [], // Should not provide anything
})
export class SharedModule {}
