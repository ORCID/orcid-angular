import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalComponent } from './modal/modal.component'
import { ModalHeaderComponent } from './modal-header/modal-header.component'
import { ModalFooterComponent } from './modal-footer/modal-footer.component'
import { ModalSideBarComponent } from './modal-side-bar/modal-side-bar.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalSideBarComponent,
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalSideBarComponent,
  ],
})
export class ModalModule {}
