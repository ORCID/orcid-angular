import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class NewRelicService {
  DECISION_KEY = 'nr-sampled' // flag in sessionStorage
  sampled: boolean
  constructor(@Inject(WINDOW) private window: Window) {
    let sampled = sessionStorage.getItem(this.DECISION_KEY)

    if (sampled === null) {
      // first time in this tab
      this.sampled = Math.random() < 0.05 // 5 % chance
      sessionStorage.setItem(this.DECISION_KEY, sampled)
    } else {
      this.sampled = sampled === 'true' // sessionStorage returns strings
    }
  }

  public init() {
    if (
      (window as any)?.newrelic?.start &&
      typeof (window as any).newrelic.start === 'function' &&
      this.sampled
    ) {
      ;(window as any).newrelic.start()
    }
  }
}
