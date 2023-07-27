import { Component, Input, OnInit } from '@angular/core'
import { log } from 'console'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ActivitySummary } from 'src/app/types/trust-summary'

@Component({
  selector: 'app-summary-panel',
  templateUrl: './summary-panel.component.html',
  styleUrls: [
    './summary-panel.component.scss',
    './summary-panel.component.scss-theme.scss',
  ],
})
export class SummaryPanelComponent implements OnInit {
  validatedSourceAriaLabel = $localize`:@@record.validatedSource:Validated source`
  selftAssertedSource = $localize`:@@record.selfAssertedSource:Self-asserted source`
  @Input() activitySummary: ActivitySummary[]
  @Input() url: string = ''
  @Input() count: number = 0
  activitiesToDisplay: ActivitySummary[]
  acitivityCountOverflow: boolean
  unsubscribe = new Subject()

  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  ngOnInit(): void {
    if (this.activitySummary) {
      this.activitySummary = [...this.activitySummary, ...this.activitySummary]
      this.activitiesToDisplay = this.activitySummary.slice(0, 3)

      this.acitivityCountOverflow = this.count > 3
    }
  }
}
