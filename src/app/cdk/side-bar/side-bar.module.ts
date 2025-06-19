import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideBarComponent } from './side-bar/side-bar.component'
import { SideBarIdComponent } from './side-bar-id/side-bar-id.component'
import { PanelModule } from '../panel/panel.module'
import { ModalModule } from '../modal/modal.module'
import { ModalEmailComponent } from './modals/modal-email/modal-email.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalCountryComponent } from './modals/modal-country/modal-country.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'
import { ModalWebsitesComponent } from './modals/modal-websites/modal-websites.component'
import { ModalKeywordComponent } from './modals/modal-keyword/modal-keyword.component'
import { ModalPersonIdentifiersComponent } from './modals/modal-person-identifiers/modal-person-identifiers.component'
import { SharedModule } from 'src/app/shared/shared.module'
import { FormDirectivesModule } from '../form-directives/form-directives.module'
import { SourceHitComponent } from './modals/source-hit/source-hit.component'
import { VisibilitySelectorModule } from '../visibility-selector/visibility-selector.module'
import { AlertMessageModule } from '../alert-message/alert-message.module'

@NgModule({
  declarations: [
    SideBarComponent,
    SideBarIdComponent,
    ModalEmailComponent,
    ModalCountryComponent,
    ModalWebsitesComponent,
    ModalKeywordComponent,
    ModalPersonIdentifiersComponent,
    SourceHitComponent,
  ],
  imports: [
    CommonModule,
    PanelModule,
    SharedModule,
    ModalModule,
    AlertMessageModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    VisibilitySelectorModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    MatSelectModule,
    A11yLinkModule,
    FormDirectivesModule,
  ],
  exports: [SideBarComponent, SourceHitComponent],
})
export class SideBarModule {}
