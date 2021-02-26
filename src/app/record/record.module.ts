import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RecordRoutingModule } from './record-routing.module'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { MainComponent } from './components/main/main.component'
import { PannelModule } from '../cdk/pannel/pannel.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { ModalNameComponent } from './components/top-bar/modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from './components/top-bar/modals/modal-biography/modal-biography.component'
import { ModalModule } from '../cdk/modal/modal.module'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrivacySelectorModule } from '../cdk/privacy-selector/privacy-selector.module'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { AffiliationsComponent } from './components/affiliations/affiliations.component'
import { AffiliationComponent } from './components/affiliation/affiliation.component'
import { ActivitiesModule } from '../cdk/activities/card.module'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [
    MyOrcidComponent,
    TopBarComponent,
    MainComponent,
    ModalNameComponent,
    ModalBiographyComponent,
    AffiliationsComponent,
    AffiliationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecordRoutingModule,
    SideBarModule,
    PannelModule,
    MatIconModule,
    MatButtonModule,
    ModalModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PrivacySelectorModule,
    DragDropModule,
    A11yLinkModule,
    ActivitiesModule,
    SharedModule,
  ],
})
export class RecordModule {}
