import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WarningMessageComponent } from './warning-message/warning-message.component'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [WarningMessageComponent],
  imports: [CommonModule, MatIconModule],
  exports: [WarningMessageComponent],
})
export class WarningMessageModule {}
