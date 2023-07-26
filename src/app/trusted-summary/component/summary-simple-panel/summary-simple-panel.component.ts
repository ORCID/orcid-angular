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
export class SummarySimplePanelComponent implements OnInit, OnDestroy {
  validatedSourceAriaLabel = $localize`:@@record.validatedSource:Validated source`
  selftAssertedSource = $localize`:@@record.selfAssertedSource:Self-asserted source`
  @Input() simpleActivities: SimpleActivityModel[] = []
  unsubscribe = new Subject()
  mobile: boolean

  constructor(private _platform: PlatformInfoService) {}
  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((platform) => {
        if (platform.columns4 || platform.columns8) {
          this.mobile = true
        } else {
          this.mobile = false
        }
      })
  }
}
