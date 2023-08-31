import { Component, Inject, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { WINDOW } from 'src/app/cdk/window'
import { ActivitySummary } from 'src/app/types/trust-summary'

@Component({
  selector: 'app-summary-panel',
  templateUrl: './summary-panel.component.html',
  styleUrls: [
    './summary-panel.component.scss',
    './summary-panel.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class SummaryPanelComponent implements OnInit {
  validatedSourceAriaLabel = $localize`:@@summary.validatedSource:Validated source`
  selftAssertedSource = $localize`:@@summary.selfAssertedSource:Self-asserted source`
  @Input() activitySummary: ActivitySummary[]
  @Input() url: string = ''
  @Input() count: number = 0
  @Input() moreLabel: string = ''
  @Input() moreLabelSingular: string = ''
  @Input() showToPresent = true
  @Input() hoverEffect = false
  activitiesToDisplay: ActivitySummary[]
  acitivityCountOverflow: boolean
  unsubscribe = new Subject()

  constructor(@Inject(WINDOW) private _window: Window) {}

  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  ngOnInit(): void {
    if (this.activitySummary) {
      this.activitySummary = [...this.activitySummary]
      this.activitiesToDisplay = this.activitySummary.slice(0, 3)

      this.acitivityCountOverflow = this.count > 3
    }
  }
  goToUrl(url?: string) {
    if (!url) {
      return
    }
    this._window.open(url, '_blank')
  }
}
