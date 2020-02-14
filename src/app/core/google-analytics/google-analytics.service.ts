import { Injectable, Inject } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/cdk/window'
import { Gtag } from '../../types'
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gtag: Gtag
  constructor(@Inject(WINDOW) private window: Window) {
    this.gtag = (<any>window).gtag
  }

  reportPageView(url: string) {
    this.gtag('config', environment.GOOGLE_ANALYTICS, {
      page_path: url,
      page_location: window.location.origin,
      anonymize_ip: true,
      sample_rate: '70',
    })
  }
}
