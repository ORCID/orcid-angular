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
import { RegionCityCountryPipe } from './pipes/region-city-country/region-city-country.pipe'
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe'
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
    RegionCityCountryPipe,
    SafeHtmlPipe,
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
    RegionCityCountryPipe,
    SafeHtmlPipe,
  ],
  entryComponents: [CopyOnClickComponent],
  providers: [], // Should not provide anything
})
export class SharedModule {}
