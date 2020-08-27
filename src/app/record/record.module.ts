import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RecordRoutingModule } from './record-routing.module'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'
import { SideBarComponent } from './components/side-bar/side-bar.component'
import { SideBarIdComponent } from './components/side-bar-id/side-bar-id.component'

@NgModule({
  declarations: [MyOrcidComponent, SideBarComponent, SideBarIdComponent],
  imports: [CommonModule, RecordRoutingModule],
})
export class RecordModule {}
