import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RecordRoutingModule } from './record-routing.module'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { MainComponent } from './components/main/main.component'
import { PannelModule } from '../cdk/pannel/pannel.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'

@NgModule({
  declarations: [MyOrcidComponent, TopBarComponent, MainComponent],
  imports: [CommonModule, RecordRoutingModule, SideBarModule, PannelModule],
})
export class RecordModule {}
