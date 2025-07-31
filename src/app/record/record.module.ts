import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { ModalModule } from '../cdk/modal/modal.module'
import { PanelModule } from '../cdk/panel/panel.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { TrustedIndividualsDropdownModule } from '../cdk/trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { LayoutModule } from '../layout/layout.module'
import { SharedModule } from '../shared/shared.module'
import { AffiliationStackComponent } from './components/affiliation-stack/affiliation-stack.component'
import { AffiliationStacksGroupsComponent } from './components/affiliation-stacks-groups/affiliation-stacks-groups.component'
import { ModalAffiliationsComponent } from './components/affiliation-stacks-groups/modals/modal-affiliations/modal-affiliations.component'
import { AffiliationComponent } from './components/affiliation/affiliation.component'
import { DisplayAttributeComponent } from './components/display-attribute/display-attribute.component'
import { DisplayExternalIdsComponent } from './components/display-external-ids/display-external-ids.component'
import { FundingStackComponent } from './components/funding-stack/funding-stack.component'
import { FundingStacksGroupsComponent } from './components/funding-stacks-groups/funding-stacks-groups.component'
import { ModalFundingComponent } from './components/funding-stacks-groups/modals/modal-funding/modal-funding.component'
import { FundingComponent } from './components/funding/funding.component'
import { MainComponent } from './components/main/main.component'
import { ModalDeleteItemsComponent } from './components/modals/modal-delete-item/modal-delete-items.component'
import { OrgIdentifierComponent } from './components/org-identifier/org-identifier.component'
import { PeerReviewStackComponent } from './components/peer-review-stack/peer-review-stack.component'
import { ModalPeerReviewsComponent } from './components/peer-review-stacks-groups/modals/modal-peer-reviews/modal-peer-reviews.component'
import { PeerReviewStacksGroupsComponent } from './components/peer-review-stacks-groups/peer-review-stacks-groups.component'
import { PeerReviewComponent } from './components/peer-review/peer-review.component'
import { ResearchResourceStackComponent } from './components/research-resource-stack/research-resource-stack.component'
import { ResearchResourceStacksGroupComponent } from './components/research-resource-stacks-group/research-resource-stacks-group.component'
import { ResearchResourceComponent } from './components/research-resource/research-resource.component'
import { TopBarActionsComponent } from './components/top-bar-actions/top-bar-actions.component'
import { TopBarRecordIssuesComponent } from './components/top-bar-record-issues/top-bar-record-issues.component'
import { ModalBiographyComponent } from './components/top-bar/modals/modal-biography/modal-biography.component'
import { ModalNameComponent } from './components/top-bar/modals/modal-name/modal-name.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { WorkStackGroupComponent } from './components/work-stack-group/work-stack-group.component'
import { WorkStackComponent } from './components/work-stack/work-stack.component'
import { ModalCombineWorksComponent } from './components/work/modals/modal-combine-works/modal-combine-works.component'
import { WorkComponent } from './components/work/work.component'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'
import { RecordRoutingModule } from './record-routing.module'
import { ModalFundingSearchLinkComponent } from './components/funding-stacks-groups/modals/modal-funding-search-link/modal-funding-search-link.component'
import { SearchLinkWizardComponent } from './components/search-link-wizard/search-link-wizard.component'
import { WorksVisibilityModalComponent } from './components/work/modals/works-visibility-modal/works-visibility-modal.component'
import { WorkBibtexModalComponent } from './components/work-stack-group/modals/work-bibtex-modal/work-bibtex-modal.component'
import { ModalWorksSearchLinkComponent } from './components/work-stack-group/modals/work-search-link-modal/modal-works-search-link.component'
import { WorkExternalIdModalComponent } from './components/work-stack-group/modals/work-external-id-modal/work-external-id-modal.component'
import { WorkFormComponent } from './components/work-form/work-form/work-form.component'
import { WorkExternalIdentifiersEditComponent } from './components/work-external-identifiers-edit/work-external-identifiers-edit.component'
import { FundingExternalIdentifiersEditComponent } from './components/funding-external-identifiers-edit/funding-external-identifiers-edit.component'
import { ModalExportWorksComponent } from './components/work/modals/modal-export-works/modal-export-works.component'
import { WorkModalComponent } from './components/work-modal/work-modal.component'
import { FundingExternalIdentifiersViewOnlyComponent } from './components/funding-external-identifiers-view-only/funding-external-identifiers-view-only.component'
import { WorkExternalIdentifiersViewOnlyComponent } from './components/work-external-identifiers-view-only/work-external-identifiers-view-only.component'
import { TextFieldModule } from '@angular/cdk/text-field'
import { VerificationEmailModalService } from '../core/verification-email-modal/verification-email-modal.service'
import { ModalCombineWorksWithSelectorComponent } from './components/work/modals/modal-combine-works-with-selector/modal-combine-works-with-selector.component'
import { TopBarMyPublicRecordPreviewModule } from '../cdk/top-bar-my-public-record-preview/top-bar-my-public-record-preview.module'
import { WorkContributorRolesComponent } from './components/work-contributor-role/work-contributor-roles.component'
import { WorkContributorsComponent } from './components/work-contributors/work-contributors.component'
import { VisibilitySelectorModule } from '../cdk/visibility-selector/visibility-selector.module'
import { TopBarVerificationEmailModule } from '../cdk/top-bar-verification-email/top-bar-verification-email.module'
import { RecordHeaderComponent } from './components/record-header/record-header.component'
import { RecordInfoComponent } from './components/record-info/record-info.component'
import { TrustedSummaryModule } from '../cdk/trusted-summary/trusted-summary.module'
import { AlertMessageModule } from '../cdk/alert-message/alert-message.module'
import { MatDialogModule } from '@angular/material/dialog'
import { WarningMessageModule } from '../cdk/warning-message/warning-message.module'
import { DeepSelectInputModule } from '../cdk/deep-select-input/deep-select-input.module'
import { PageNotFound404Module } from '../page-not-found-404/page-not-found-404.module'
import { LoginMainInterstitialsManagerService } from '../core/login-interstitials-manager/login-main-interstitials-manager.service'
import { WorkFeaturedStackGroupComponent } from './components/work-featured-stack-group/work-featured-stack-group.component'
import { WorkFeaturedComponent } from './components/work-featured/work-featured.component'

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
    WorkFeaturedComponent,
    WorkFeaturedStackGroupComponent,
    TopBarActionsComponent,
    TopBarRecordIssuesComponent,
    ModalAffiliationsComponent,
    OrgIdentifierComponent,
    ModalFundingComponent,
    ResearchResourceStackComponent,
    ResearchResourceComponent,
    PeerReviewStackComponent,
    PeerReviewComponent,
    ModalExportWorksComponent,
    ModalCombineWorksComponent,
    ModalWorksSearchLinkComponent,
    ModalDeleteItemsComponent,
    ModalFundingSearchLinkComponent,
    SearchLinkWizardComponent,
    WorksVisibilityModalComponent,
    WorkBibtexModalComponent,
    WorkExternalIdModalComponent,
    WorkFormComponent,
    WorkExternalIdentifiersEditComponent,
    WorkExternalIdentifiersViewOnlyComponent,
    FundingExternalIdentifiersEditComponent,
    FundingExternalIdentifiersViewOnlyComponent,
    WorkFormComponent,
    WorkModalComponent,
    ModalCombineWorksWithSelectorComponent,
    WorkContributorRolesComponent,
    WorkContributorsComponent,
    RecordHeaderComponent,
    RecordInfoComponent,
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
    VisibilitySelectorModule,
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
    SharedModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule,
    TextFieldModule,
    WarningMessageModule,
    AlertMessageModule,
    TopBarMyPublicRecordPreviewModule,
    TopBarVerificationEmailModule,
    TrustedSummaryModule,
    MatDialogModule,
    DeepSelectInputModule,
    PageNotFound404Module,
  ],
  providers: [
    VerificationEmailModalService,
    LoginMainInterstitialsManagerService,
  ],
})
export class RecordModule {}
