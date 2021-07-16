import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatDivider, MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

import { CopyOnClickComponent } from './components/copy-on-click/copy-on-click.component'
import { OfflineMessageComponent } from './components/offline-message/offline-message.component'
import { CopyOnClickDirective } from './directives/copy-on-click/copy-on-click.directive'
import { MonthDayYearDateToStringPipe } from './pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe'
import { ShowingOfComponent } from './components/showing-of/showing-of.component'
import { CityRegionCountry } from './pipes/city-region-country/city-region-country.pipe'
import { ContributorsPipe } from './pipes/contributors-pipe/contributors.pipe'
import { RecordWorkCategoryLabelPipe } from './pipes/record-work-category-label/record-work-category-label.pipe'
import { RecordWorkTypeLabelPipe } from './pipes/record-work-type-label/record-work-type-label.pipe'
import { RecordWorkRelationshipLabelPipe } from './pipes/record-work-relationship-label/record-work-relationship-label.pipe'
import { RecordWorkRelationshipHintLabelPipe } from './pipes/record-work-relationship-hint-label/record-work-relationship-hint-label.pipe'
import { RecordWorkTitleNameLabelPipe } from './pipes/record-work-title-name-label/record-work-title-name-label.pipe'
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
    SafeHtmlPipe,
    ShowingOfComponent,
    RecordWorkCategoryLabelPipe,
    RecordWorkTypeLabelPipe,
    RecordWorkRelationshipLabelPipe,
    RecordWorkRelationshipHintLabelPipe,
    RecordWorkTitleNameLabelPipe,
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
    ContributorsPipe,
    SafeHtmlPipe,
    ShowingOfComponent,
    RecordWorkCategoryLabelPipe,
    RecordWorkTypeLabelPipe,
    RecordWorkRelationshipLabelPipe,
    RecordWorkRelationshipHintLabelPipe,
    RecordWorkTitleNameLabelPipe,
  ],
  providers: [], // Should not provide anything
})
export class SharedModule {}
