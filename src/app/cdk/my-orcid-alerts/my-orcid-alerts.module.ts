import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyOrcidAlertsComponent } from './my-orcid-alerts.component'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { AlertMessageModule } from '../alert-message/alert-message.module'

@NgModule({
  declarations: [MyOrcidAlertsComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule, AlertMessageModule],
  exports: [MyOrcidAlertsComponent],
})
export class MyOrcidAlertsModule {}
