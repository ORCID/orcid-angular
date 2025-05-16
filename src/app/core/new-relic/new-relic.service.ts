import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class NewRelicService {
  private readonly DECISION_KEY = 'nr-sampled';
  private sampled = false;

  constructor(@Inject(WINDOW) private readonly window: Window) {
    if (!this.window?.sessionStorage) {
      return;                           
    }

    const stored = this.window.sessionStorage.getItem(this.DECISION_KEY);

    if (stored === null) {
      // First navigation in this tab: 5 % chance to enable sampling
      this.sampled = Math.random() < 0.05;
      this.window.sessionStorage.setItem(
        this.DECISION_KEY,
        JSON.stringify(this.sampled),
      );
    } else {
      this.sampled = stored === 'true';
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
