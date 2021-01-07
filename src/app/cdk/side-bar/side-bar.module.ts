import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideBarComponent } from './side-bar/side-bar.component'
import { SideBarIdComponent } from './side-bar-id/side-bar-id.component'
import { PannelModule } from '../pannel/pannel.module'
import { AlsoKnowAsComponent } from './modals/also-know-as/also-know-as.component'
import { ModalModule } from '../modal/modal.module'
import { ModalEmailComponent } from './modals/modal-email/modal-email.component'
import { MatDialogModule } from '@angular/material/dialog'

@NgModule({
  declarations: [
    SideBarComponent,
    SideBarIdComponent,
    AlsoKnowAsComponent,
    ModalEmailComponent,
  ],
  imports: [CommonModule, PannelModule, ModalModule, MatDialogModule],
  exports: [SideBarComponent],
})
export class SideBarModule {}
