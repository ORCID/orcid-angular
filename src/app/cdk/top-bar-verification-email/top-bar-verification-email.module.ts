import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopBarVerificationEmailComponent } from './top-bar-verification-email.component'
import { ModalModule } from '../modal/modal.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { TopBarVerificationEmailModalComponent } from './modals/top-bar-verification-email-modal/top-bar-verification-email-modal.component'
import { AlertMessageModule } from '../alert-message/alert-message.module'

@NgModule({
  declarations: [
    TopBarVerificationEmailComponent,
    TopBarVerificationEmailModalComponent,
  ],
  imports: [
    CommonModule,
    AlertMessageModule,
    ModalModule,
    MatButtonModule,
    MatIconModule,
    ModalModule,
    ModalModule,
  ],
  exports: [TopBarVerificationEmailComponent],
})
export class TopBarVerificationEmailModule {}
