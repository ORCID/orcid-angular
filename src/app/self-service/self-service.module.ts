import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { SelfServiceRoutingModule } from './self-service-routing.module'
import { SelfServiceComponent } from './self-service/self-service.component'

@NgModule({
  declarations: [SelfServiceComponent],
  imports: [CommonModule, SelfServiceRoutingModule, MatIconModule],
})
export class SelfServiceModule {}
