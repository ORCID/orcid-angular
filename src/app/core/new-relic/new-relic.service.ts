import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class NewRelicService {
 
  constructor(    @Inject(WINDOW) private window: Window,
) {}

  public init() {
    if ((window as any).newrelic) {
      (window as any).newrelic.addPageAction('init')
    }
  }

}
