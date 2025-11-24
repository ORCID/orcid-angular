import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyOrcidAlertsComponent } from './my-orcid-alerts.component'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { AlertMessageComponent } from '@orcid/ui'

@NgModule({
  declarations: [MyOrcidAlertsComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule, AlertMessageComponent],
  exports: [MyOrcidAlertsComponent],
})
export class MyOrcidAlertsModule {}
