import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SummaryPanelComponent } from './component/summary-panel/summary-panel.component'
import { SummarySimplePanelComponent } from './component/summary-simple-panel/summary-simple-panel.component'
import { SummaryDatesPanelComponent } from './component/summary-dates-panel/summary-dates-panel.component'
import { TrustedSummaryComponent } from './pages/trusted-summary/trusted-summary.component'
import { TrustedSummaryRouting } from './trusted-summary-routing.module'
import { MatIconModule } from '@angular/material/icon'
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner'

@NgModule({
  declarations: [
    SummaryPanelComponent,
    SummarySimplePanelComponent,
    SummaryDatesPanelComponent,
    TrustedSummaryComponent,
  ],
  imports: [
    CommonModule,
    TrustedSummaryRouting,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class TrustedSummaryModule {}
