import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SummaryPanelComponent } from './component/summary-panel/summary-panel.component'
import { SummarySimplePanelComponent } from './component/summary-simple-panel/summary-simple-panel.component'
import { TrustedSummaryComponent } from './component/trusted-summary/trusted-summary.component'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [
    SummaryPanelComponent,
    SummarySimplePanelComponent,
    TrustedSummaryComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
  exports: [TrustedSummaryComponent],
})
export class TrustedSummaryModule {}
