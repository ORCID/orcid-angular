import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'

import { ModalFooterComponent } from './modal-footer/modal-footer.component'
import { ModalHeaderComponent } from './modal-header/modal-header.component'
import { ModalSideBarComponent } from './modal-side-bar/modal-side-bar.component'
import { ModalComponent } from './modal/modal.component'

@NgModule({
  declarations: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalSideBarComponent,
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
  ],
})
export class ModalModule {}
