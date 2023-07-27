import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

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
  validatedSourceAriaLabel = $localize`:@@record.validatedSource:Validated source`
  selftAssertedSource = $localize`:@@record.selfAssertedSource:Self-asserted source`
  @Input() simpleActivities: SimpleActivityModel[] = []
  @Input() count: number = 0
  @Input() overflowUrl: string = ''
  unsubscribe = new Subject()
  mobile: boolean
  acitivityCountOverflow = false

  ngOnInit(): void {
    this.acitivityCountOverflow = this.simpleActivities.length > 3
    this.simpleActivities = this.simpleActivities.slice(0, 3)
  }
}
