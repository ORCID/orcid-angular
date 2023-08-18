import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SummaryPanelComponent } from './component/summary-panel/summary-panel.component'
import { SummarySimplePanelComponent } from './component/summary-simple-panel/summary-simple-panel.component'
import { TrustedSummaryComponent } from './pages/trusted-summary/trusted-summary.component'
import { TrustedSummaryRouting } from './trusted-summary-routing.module'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [
    SummaryPanelComponent,
    SummarySimplePanelComponent,
    TrustedSummaryComponent,
  ],
  imports: [
    CommonModule,
    TrustedSummaryRouting,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
})
export class TrustedSummaryModule {}
