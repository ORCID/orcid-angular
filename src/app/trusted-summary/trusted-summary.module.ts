import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TrustedSummaryPageRouting } from './trusted-summary-routing.module'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { SharedModule } from '../shared/shared.module'
import { TrustedSummaryModule } from '../cdk/trusted-summary/trusted-summary.module'
import { TrustedSummaryPageComponent } from './pages/trusted-summary/trusted-summary.component'

@NgModule({
  declarations: [TrustedSummaryPageComponent],
  imports: [TrustedSummaryModule, TrustedSummaryPageRouting],
})
export class TrustedSummaryPageModule {}
