import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatDivider,
  MatDividerModule,
  MatExpansionModule,
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material'
import { MatTooltipModule } from '@angular/material/tooltip'

import { MonthDayYearDateToStringPipe } from './pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'
import { OfflineMessageComponent } from './components/offline-message/offline-message.component'

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  declarations: [MonthDayYearDateToStringPipe, OfflineMessageComponent],
  exports: [
    MatDivider,
    MatTooltipModule,
    MatProgressSpinner,
    MatExpansionModule,
    MonthDayYearDateToStringPipe,
    OfflineMessageComponent,
  ],
  providers: [], // Should not provide anything
})
export class SharedModule {}
