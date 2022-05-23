import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopBarMyPublicRecordPreviewComponent } from './top-bar-my-public-record-preview/top-bar-my-public-record-preview.component'
import { MatIconModule } from '@angular/material/icon'
import { TrustedIndividualsDropdownModule } from '../trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { MatDividerModule } from '@angular/material/divider'

@NgModule({
  declarations: [TopBarMyPublicRecordPreviewComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TrustedIndividualsDropdownModule,
    MatDividerModule,
  ],
  exports: [TopBarMyPublicRecordPreviewComponent],
})
export class TopBarMyPublicRecordPreviewModule {}
