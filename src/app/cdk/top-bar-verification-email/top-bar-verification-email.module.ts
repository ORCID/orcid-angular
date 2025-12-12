import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopBarVerificationEmailComponent } from './top-bar-verification-email.component'
import { ModalModule } from '../modal/modal.module'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { TopBarVerificationEmailModalComponent } from './modals/top-bar-verification-email-modal/top-bar-verification-email-modal.component'
import { AlertMessageComponent } from '@orcid/ui'

@NgModule({
  declarations: [
    TopBarVerificationEmailComponent,
    TopBarVerificationEmailModalComponent,
  ],
  imports: [
    CommonModule,
    AlertMessageComponent,
    ModalModule,
    MatButtonModule,
    MatIconModule,
    ModalModule,
    ModalModule,
  ],
  exports: [TopBarVerificationEmailComponent],
})
export class TopBarVerificationEmailModule {}
