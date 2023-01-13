import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatDivider, MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatPaginatorModule } from '@angular/material/paginator'
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

import { CopyOnClickComponent } from './components/copy-on-click/copy-on-click.component'
import { OfflineMessageComponent } from './components/offline-message/offline-message.component'
import { ShowingOfComponent } from './components/showing-of/showing-of.component'
import { CopyOnClickDirective } from './directives/copy-on-click/copy-on-click.directive'
import { AffiliationTypeLabelPipe } from './pipes/affiliation-type/affiliation-type-label.pipe'
import { CityRegionCountry } from './pipes/city-region-country/city-region-country.pipe'
import { FormatBibtex } from './pipes/format-bibtex/format-bibtex.pipe'
import { ContributorsPipe } from './pipes/contributors-pipe/contributors.pipe'
import { EmailFrequencyLabelPipe } from './pipes/email-frequency-label/email-frequency-label.pipe'
import { MonthDayYearDateToStringPipe } from './pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'
import { RecordFundingRelationshipHintLabelPipe } from './pipes/record-funding-relationship-hint-label/record-funding-relationship-hint-label.pipe'
import { RecordFundingRelationshipLabelPipe } from './pipes/record-funding-relationship-label/record-funding-relationship-label.pipe'
import { RecordFundingTypeLabelPipe } from './pipes/record-funding-type-label/record-funding-type-label.pipe'
import { RecordWorkCategoryLabelPipe } from './pipes/record-work-category-label/record-work-category-label.pipe'
import { RecordWorkRelationshipHintLabelPipe } from './pipes/record-work-relationship-hint-label/record-work-relationship-hint-label.pipe'
import { RecordWorkRelationshipLabelPipe } from './pipes/record-work-relationship-label/record-work-relationship-label.pipe'
import { RecordWorkTitleNameLabelPipe } from './pipes/record-work-title-name-label/record-work-title-name-label.pipe'
import { RecordWorkTypeLabelPipe } from './pipes/record-work-type-label/record-work-type-label.pipe'
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe'
import { TrailingZerosPipe } from './pipes/trailing-zeros/trailing-zeros.pipe'
import { VisibilityStringLabelPipe } from './pipes/visibility-string-label/visibility-string-label.pipe'
import { DisableRolePipe } from './pipes/disabled-role/disable-role.pipe'
import { RoleTranslationPipe } from './pipes/role-translation/role-translation.pipe'
import { RecordHolderRolesPipe } from './pipes/record-holder-roles/record-holder-roles.pipe'
import { IsUrlPipe } from './pipes/is-url/is-url.pipe'
import { IsUrlWithProtocolPipe } from './pipes/is-url-with-protocol/is-url-with-protocol.pipe'
import { OrganizationLinkPipe } from './pipes/organization-link/organization-link.pipe'
import { ContributorRolesPipe } from './pipes/contributors-roles/contributor-roles.pipe'
import { EditButtonAriaLabelPipe } from './pipes/edit-button-aria-label/edit-button-aria-label.pipe'
import { AppPanelsExpandAriaLabelPipe } from './pipes/app-panels-expand-aria-label/app-panels-expand-aria-label.pipe'
import { AppPanelsCollapseAriaLabelPipe } from './pipes/app-panels-collapse-aria-label/app-panels-collapse-aria-label.pipe'
import { ReplaceTextPipe } from './pipes/replace-text/replace-text.pipe'
import { AppPanelsAddAriaLabelPipe } from './pipes/app-panels-add-aria-label/app-panels-add-aria-label.pipe'
import { AppPanelsSortAriaLabelPipe } from './pipes/app-panels-sort-aria-label/app-panels-sort-aria-label.pipe'
import { AppPanelActivityActionAriaLabelPipe } from './pipes/app-panel-activity-action-aria-label/app-panel-activity-action-aria-label.pipe'
import { SortByPipe } from './pipes/sort-by/sort-by.pipe'
import { AffiliationLabelPipe } from './pipes/affiliation-label.pipe'
@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatPaginatorModule,
  ],
  declarations: [
    MonthDayYearDateToStringPipe,
    OfflineMessageComponent,
    CopyOnClickDirective,
    CopyOnClickComponent,
    CityRegionCountry,
    ContributorsPipe,
    FormatBibtex,
    SafeHtmlPipe,
    ShowingOfComponent,
    RecordWorkCategoryLabelPipe,
    RecordWorkTypeLabelPipe,
    RecordWorkRelationshipLabelPipe,
    RecordWorkRelationshipHintLabelPipe,
    RecordWorkTitleNameLabelPipe,
    RecordFundingRelationshipLabelPipe,
    RecordFundingRelationshipHintLabelPipe,
    RecordFundingTypeLabelPipe,
    AffiliationTypeLabelPipe,
    TrailingZerosPipe,
    VisibilityStringLabelPipe,
    EmailFrequencyLabelPipe,
    DisableRolePipe,
    RoleTranslationPipe,
    RecordHolderRolesPipe,
    IsUrlPipe,
    IsUrlWithProtocolPipe,
    OrganizationLinkPipe,
    ContributorRolesPipe,
    EditButtonAriaLabelPipe,
    AppPanelsExpandAriaLabelPipe,
    AppPanelsCollapseAriaLabelPipe,
    ReplaceTextPipe,
    AppPanelsAddAriaLabelPipe,
    AppPanelsSortAriaLabelPipe,
    AppPanelActivityActionAriaLabelPipe,
    SortByPipe,
    AffiliationLabelPipe,
  ],
  exports: [
    CommonModule,
    MatDivider,
    MatTooltipModule,
    MatProgressSpinner,
    MatExpansionModule,
    MonthDayYearDateToStringPipe,
    OfflineMessageComponent,
    MatPaginatorModule,
    CopyOnClickDirective,
    MatSnackBarModule,
    CityRegionCountry,
    FormatBibtex,
    ContributorsPipe,
    SafeHtmlPipe,
    ShowingOfComponent,
    RecordWorkCategoryLabelPipe,
    RecordWorkTypeLabelPipe,
    RecordWorkRelationshipLabelPipe,
    RecordWorkRelationshipHintLabelPipe,
    RecordWorkTitleNameLabelPipe,
    RecordFundingRelationshipLabelPipe,
    RecordFundingRelationshipHintLabelPipe,
    RecordFundingTypeLabelPipe,
    AffiliationTypeLabelPipe,
    TrailingZerosPipe,
    VisibilityStringLabelPipe,
    EmailFrequencyLabelPipe,
    DisableRolePipe,
    RoleTranslationPipe,
    RecordHolderRolesPipe,
    IsUrlPipe,
    IsUrlWithProtocolPipe,
    OrganizationLinkPipe,
    ContributorRolesPipe,
    EditButtonAriaLabelPipe,
    AppPanelsExpandAriaLabelPipe,
    AppPanelsCollapseAriaLabelPipe,
    ReplaceTextPipe,
    AppPanelsAddAriaLabelPipe,
    AppPanelsSortAriaLabelPipe,
    AppPanelActivityActionAriaLabelPipe,
    SortByPipe,
  ],
  providers: [], // Should not provide anything
})
export class SharedModule {}
