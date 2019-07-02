import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MultiRowRaisedButtonComponent } from './multi-row-raised-button/multi-row-raised-button.component'
import { MatButtonModule } from '@angular/material'

@NgModule({
  declarations: [MultiRowRaisedButtonComponent],
  exports: [MultiRowRaisedButtonComponent],
  imports: [CommonModule, MatButtonModule],
})
export class MultiRowRaisedButtonModule {}
