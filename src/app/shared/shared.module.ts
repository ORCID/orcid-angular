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
import { MatPaginatorModule } from '@angular/material/paginator'
import { CopyOnClickDirective } from './directives/copy-on-click/copy-on-click.directive'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { CopyOnClickComponent } from './components/copy-on-click/copy-on-click.component'

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  declarations: [
    MonthDayYearDateToStringPipe,
    OfflineMessageComponent,
    CopyOnClickDirective,
    CopyOnClickComponent,
  ],
  exports: [
    MatDivider,
    MatTooltipModule,
    MatProgressSpinner,
    MatExpansionModule,
    MonthDayYearDateToStringPipe,
    OfflineMessageComponent,
    MatPaginatorModule,
    CopyOnClickDirective,
    MatSnackBarModule,
  ],
  entryComponents: [CopyOnClickComponent],
  providers: [], // Should not provide anything
})
export class SharedModule {}
