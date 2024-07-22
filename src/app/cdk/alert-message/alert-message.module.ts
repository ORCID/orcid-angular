import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AlertMessageComponent } from './alert-message.component'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [AlertMessageComponent],
  imports: [CommonModule, MatIconModule],
  exports: [AlertMessageComponent],
})
export class AlertMessageModule {}
