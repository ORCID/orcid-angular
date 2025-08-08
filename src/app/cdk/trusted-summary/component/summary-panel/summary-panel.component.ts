import { Component, Inject, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { WINDOW } from 'src/app/cdk/window'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { ActivitySummary } from 'src/app/types/trust-summary'

@Component({
  selector: 'app-summary-panel',
  templateUrl: './summary-panel.component.html',
  styleUrls: [
    './summary-panel.component.scss',
    './summary-panel.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class SummaryPanelComponent implements OnInit {
  @Input() activitySummary: ActivitySummary[]
  @Input() url: string = ''
  @Input() count: number = 0
  @Input() moreLabel: string = ''
  @Input() moreLabelSingular: string = ''
  @Input() ariaLabelActivitySection: string = ''
  @Input() showToPresent = true
  @Input() hoverEffect = false
  @Input() standaloneMode: boolean
  @Input() activitySection: string
  activitiesToDisplay: ActivitySummary[]
  acitivityCountOverflow: boolean
  unsubscribe = new Subject<void>()

  validatedSourceAriaLabel = $localize`:@@summary.validatedSource:Validated source`
  selftAssertedSource = $localize`:@@summary.selfAssertedSource:Self-asserted source`

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
  goToUrl(url: string, event?: KeyboardEvent) {
    if (!url) {
      return
    }

    if (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        this._window.open(url, '_blank')
      }
    } else {
      this._window.open(url, '_blank')
    }
  }
  goToActivitySection(activitySection: string, event?: KeyboardEvent) {
    this.standaloneMode
      ? this.goToUrl(this.url, event)
      : RecordUtil.scrollTo(activitySection, event)
  }
}
