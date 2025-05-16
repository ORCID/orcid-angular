import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class NewRelicService {
  private readonly DECISION_KEY = 'nr-sampled' // flag in sessionStorage
  sampled: boolean = false
  constructor(@Inject(WINDOW) private window: Window) {
    const stored = sessionStorage.getItem(this.DECISION_KEY)

    if (stored === null) {
      // first time in this tab
      this.sampled = Math.random() < 0.05 // 5 % chance
      sessionStorage.setItem(this.DECISION_KEY, String(this.sampled))
    } else {
      this.sampled = stored === 'true'
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
