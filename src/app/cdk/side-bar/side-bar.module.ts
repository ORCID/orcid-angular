import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideBarComponent } from './side-bar/side-bar.component'
import { SideBarIdComponent } from './side-bar-id/side-bar-id.component'
import { PannelModule } from '../pannel/pannel.module';
import { AlsoKnowAsComponent } from './modals/also-know-as/also-know-as.component'
import { ModalModule } from '../modal/modal.module';

@NgModule({
  declarations: [SideBarComponent, SideBarIdComponent, AlsoKnowAsComponent],
  imports: [CommonModule, PannelModule, ModalModule],
  exports: [SideBarComponent],
})
export class SideBarModule {}
