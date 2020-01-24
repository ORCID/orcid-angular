import { Injectable, Inject } from '@angular/core'
import { WINDOW } from '../window/window.service'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gtag
  constructor(@Inject(WINDOW) private window: Window) {
    this.gtag = (<any>window).gtag
  }

  reportPageView(url: string) {
    this.gtag('config', environment.GOOGLE_ANALYTICS, {
      page_path: url,
    })
  }
}
