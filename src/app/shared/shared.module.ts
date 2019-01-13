import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import {
  MatDividerModule,
  MatDivider,
  MatProgressSpinnerModule,
  MatProgressSpinner,
  MatExpansionModule,
  MatFormFieldModule,
} from '@angular/material'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MonthDayYearDateToStringPipe } from './pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'
import { GroupAffiliationsPipe } from './pipes/group-affiliations/group-affiliations.pipe'

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  declarations: [MonthDayYearDateToStringPipe, GroupAffiliationsPipe],
  exports: [
    MatDivider,
    MatTooltipModule,
    MatProgressSpinner,
    MatExpansionModule,
    MonthDayYearDateToStringPipe,
    GroupAffiliationsPipe,
  ],
  providers: [], // Should not provide anything
})
export class SharedModule {}
