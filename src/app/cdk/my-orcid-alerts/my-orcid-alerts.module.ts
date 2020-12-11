import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyOrcidAlertsComponent } from './my-orcid-alerts.component'
import { MatToolbarModule } from '@angular/material/toolbar'

@NgModule({
  declarations: [MyOrcidAlertsComponent],
  imports: [CommonModule, MatToolbarModule],
  exports: [MyOrcidAlertsComponent],
})
export class MyOrcidAlertsModule {}
