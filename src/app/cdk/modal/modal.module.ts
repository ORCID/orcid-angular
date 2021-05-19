import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { ModalFooterComponent } from './modal-footer/modal-footer.component'
import { ModalHeaderComponent } from './modal-header/modal-header.component'
import { ModalSideBarComponent } from './modal-side-bar/modal-side-bar.component'
import { ModalComponent } from './modal/modal.component'
import { AlertMessageComponent } from './alert-message/alert-message.component'

@NgModule({
  declarations: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalSideBarComponent,
    AlertMessageComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  exports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalSideBarComponent,
    AlertMessageComponent,
  ],
})
export class ModalModule {}
