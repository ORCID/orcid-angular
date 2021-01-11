import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideBarComponent } from './side-bar/side-bar.component'
import { SideBarIdComponent } from './side-bar-id/side-bar-id.component'
import { PannelModule } from '../pannel/pannel.module'
import { ModalModule } from '../modal/modal.module'
import { ModalEmailComponent } from './modals/modal-email/modal-email.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [SideBarComponent, SideBarIdComponent, ModalEmailComponent],
  imports: [
    CommonModule,
    PannelModule,
    ModalModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [SideBarComponent],
})
export class SideBarModule {}
