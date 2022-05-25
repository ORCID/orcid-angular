import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SelfServiceRoutingModule } from './self-service-routing.module'
import { SelfServiceComponent } from './self-service/self-service.component'
import { MatCardModule } from '@angular/material/card'


@NgModule({
  declarations: [SelfServiceComponent],
  imports: [
    CommonModule,
    SelfServiceRoutingModule,
    MatCardModule    
  ],
})
export class SelfServiceModule {}
