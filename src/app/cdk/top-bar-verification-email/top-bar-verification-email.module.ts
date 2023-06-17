import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopBarVerificationEmailComponent } from './top-bar-verification-email.component'
import { ModalModule } from '../modal/modal.module'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [TopBarVerificationEmailComponent],
  imports: [CommonModule, ModalModule, MatButtonModule],
  exports: [TopBarVerificationEmailComponent],
})
export class TopBarVerificationEmailModule {}
