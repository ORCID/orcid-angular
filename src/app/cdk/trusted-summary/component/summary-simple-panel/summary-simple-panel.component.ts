import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { TrustedSummary } from 'src/app/types/trust-summary'

export interface SimpleActivityModel {
  verified?: boolean
  url?: string
  countA?: number
  countB?: number
  stringA?: string
  stringB?: string
}
;[]

@Component({
  selector: 'app-summary-simple-panel',
  templateUrl: './summary-simple-panel.component.html',
  styleUrls: [
    './summary-simple-panel.component.scss',
    './summary-simple-panel.component.scss-theme.scss',
  ],
})
export class SummarySimplePanelComponent implements OnInit {
  @Input() simpleActivities: SimpleActivityModel[] = []
  @Input() count: number = 0
  @Input() moreLabel: string = ''
  @Input() moreLabelSingular: string = ''
  @Input() ariaLabelActivitySection: string = ''
  @Input() hoverEffect = false
  @Input() overflowUrl: string = ''
  @Input() standaloneMode: boolean
  @Input() activitySection: string
  @Input() trustedSummary: TrustedSummary

  unsubscribe = new Subject()
  mobile: boolean
  acitivityCountOverflow = false

  validatedSourceAriaLabel = $localize`:@@summary.validatedSource:Validated source`
  selfAssertedSource = $localize`:@@summary.selfAssertedSource:Self-asserted source`

  constructor(@Inject(WINDOW) private _window: Window) {}

  ngOnInit(): void {
    this.acitivityCountOverflow = this.simpleActivities.length > 3 || this.count > 3
    this.simpleActivities = this.simpleActivities.slice(0, 3)
  }
  goToUrl(url?: string, event?: KeyboardEvent) {
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
      ? this.goToUrl(this.overflowUrl, event)
      : RecordUtil.scrollTo(activitySection, event)
  }
}
