import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RecordRoutingModule } from './record-routing.module'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'
import { SideBarComponent } from './components/side-bar/side-bar.component'
import { SideBarIdComponent } from './components/side-bar-id/side-bar-id.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { MainComponent } from './components/main/main.component'
import { PannelModule } from '../cdk/pannel/pannel.module'

@NgModule({
  declarations: [
    MyOrcidComponent,
    SideBarComponent,
    SideBarIdComponent,
    TopBarComponent,
    MainComponent,
  ],
  imports: [CommonModule, RecordRoutingModule, PannelModule],
})
export class RecordModule {}
