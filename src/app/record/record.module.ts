import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RecordRoutingModule } from './record-routing.module'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { MainComponent } from './components/main/main.component'
import { PanelModule } from '../cdk/panel/panel.module'
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
import { SharedModule } from '../shared/shared.module'
import { AffiliationStackComponent } from './components/affiliation-stack/affiliation-stack.component'
import { AffiliationStacksGroupsComponent } from './components/affiliation-stacks-groups/affiliation-stacks-groups.component'
import { AffiliationComponent } from './components/affiliation/affiliation.component'
import { PeerReviewStacksGroupsComponent } from './components/peer-review-stacks-groups/peer-review-stacks-groups.component'
import { ModalPeerReviewsComponent } from './components/peer-review-stacks-groups/modals/modal-peer-reviews/modal-peer-reviews.component'
import { DisplayExternalIdsComponent } from './components/display-external-ids/display-external-ids.component'
import { DisplayAttributeComponent } from './components/display-attribute/display-attribute.component'
import { FundingStacksGroupsComponent } from './components/funding-stacks-groups/funding-stacks-groups.component'
import { FundingStackComponent } from './components/funding-stack/funding-stack.component'
import { FundingComponent } from './components/funding/funding.component'
import { ResearchResourceStacksGroupComponent } from './components/research-resource-stacks-group/research-resource-stacks-group.component'
import { WorkStackGroupComponent } from './components/work-stack-group/work-stack-group.component'
import { WorkStackComponent } from './components/work-stack/work-stack.component'
import { WorkComponent } from './components/work/work.component'
import { TopBarActionsComponent } from './components/top-bar-actions/top-bar-actions.component'
import { MatDividerModule } from '@angular/material/divider'
import { TopBarMyPublicRecordPreviewComponent } from './components/top-bar-my-public-record-preview/top-bar-my-public-record-preview.component'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { LayoutModule } from '../layout/layout.module'
import { TopBarRecordIssuesComponent } from './components/top-bar-record-issues/top-bar-record-issues.component'
import { NotFoundComponent } from './components/not-found/not-found.component'
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu'
import { TrustedIndividualsDropdownModule } from '../cdk/trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { MatPaginatorModule } from '@angular/material/paginator'
import { WorkModalComponent } from './components/work-modal/work-modal.component'
import { MatRadioModule } from '@angular/material/radio'
import { ModalAffiliationsComponent } from './components/affiliation-stacks-groups/modals/modal-affiliations/modal-affiliations.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { OrgIdentifierComponent } from './components/org-identifier/org-identifier.component'
import { ModalFundingComponent } from './components/funding-stacks-groups/modals/modal-funding/modal-funding.component'
import { MatRadioModule } from '@angular/material/radio'
import { ResearchResourceStackComponent } from './components/research-resource-stack/research-resource-stack.component'
import { ResearchResourceComponent } from './components/research-resource/research-resource.component'
import { PeerReviewStackComponent } from './components/peer-review-stack/peer-review-stack.component'
import { PeerReviewComponent } from './components/peer-review/peer-review.component'

@NgModule({
  declarations: [
    MyOrcidComponent,
    TopBarComponent,
    MainComponent,
    ModalNameComponent,
    ModalBiographyComponent,
    AffiliationStacksGroupsComponent,
    AffiliationStackComponent,
    AffiliationComponent,
    FundingStacksGroupsComponent,
    FundingStackComponent,
    FundingComponent,
    DisplayExternalIdsComponent,
    DisplayAttributeComponent,
    PeerReviewStacksGroupsComponent,
    ModalPeerReviewsComponent,
    ResearchResourceStacksGroupComponent,
    WorkStackGroupComponent,
    WorkStackComponent,
    WorkComponent,
    TopBarActionsComponent,
    TopBarMyPublicRecordPreviewComponent,
    TopBarRecordIssuesComponent,
    NotFoundComponent,
    WorkModalComponent,
    ModalAffiliationsComponent,
    OrgIdentifierComponent,

    ModalFundingComponent,
    ResearchResourceStackComponent,
    ResearchResourceComponent,
    PeerReviewStackComponent,
    PeerReviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecordRoutingModule,
    SideBarModule,
    PanelModule,
    MatIconModule,
    MatButtonModule,
    ModalModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PrivacySelectorModule,
    DragDropModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    A11yLinkModule,
    MatProgressBarModule,
    LayoutModule,
    MatCardModule,
    MatMenuModule,
    TrustedIndividualsDropdownModule,
    MatPaginatorModule,
    MatRadioModule,
    SharedModule,
    MatAutocompleteModule,
    MatRadioModule,
  ],
})
export class RecordModule {}
