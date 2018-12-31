import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatDividerModule, MatDivider } from '@angular/material'

@NgModule({
  imports: [CommonModule, MatDividerModule],
  declarations: [],
  exports: [MatDivider],
  providers: [], // Should not provide anything
})
export class SharedModule {}
