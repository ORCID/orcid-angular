import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'

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
  validatedSourceAriaLabel = $localize`:@@summary.validatedSource:Validated source`
  selfAssertedSource = $localize`:@@summary.selfAssertedSource:Self-asserted source`
  @Input() simpleActivities: SimpleActivityModel[] = []
  @Input() count: number = 0
  @Input() moreLabel: string = ''
  @Input() moreLabelSingular: string = ''
  @Input() hoverEffect = false
  @Input() overflowUrl: string = ''
  @Input() standaloneMode: boolean
  @Input() activitySection: string

  unsubscribe = new Subject()
  mobile: boolean
  acitivityCountOverflow = false
  constructor(@Inject(WINDOW) private _window: Window) {}

  ngOnInit(): void {
    this.acitivityCountOverflow = this.simpleActivities.length > 3
    this.simpleActivities = this.simpleActivities.slice(0, 3)
  }
  goToUrl(url?: string) {
    if (!url) {
      return
    }
    this._window.open(url, '_blank')
  }
  goToActivitySection(activitySection: string) {
    this.standaloneMode
      ? this.goToUrl(this.overflowUrl)
      : this.scrollTo(activitySection)
  }
  scrollTo(activitySection: string) {
    document.querySelector(`#${activitySection}`).scrollIntoView()
  }
}
