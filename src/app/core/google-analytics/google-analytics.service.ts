import { Injectable, Inject } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/cdk/window'
import { PerformanceMarks } from 'src/app/constants'
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gtag: Gtag.Gtag
  constructor(@Inject(WINDOW) private window: Window) {
    this.gtag = (<any>window).gtag
  }

  reportPageView(url: string) {
    this.gtag('config', environment.GOOGLE_ANALYTICS, {
      page_path: url,
      page_location: window.location.origin,
      anonymize_ip: true,
      sample_rate: '70',
      site_speed_sample_rate: '1',
    })
  }

  reportNavigationStart(url: string) {
    this.startPerformanceMeasurement(url)
  }

  reportNavigationEnd(url: string) {
    const duration = this.finishPerformanceMeasurement(url)
    if (duration) {
      this.gtag('event', 'timing_complete', {
        name: this.removeUrlParameters(url),
        value: Math.round(duration),
        event_category: 'angular_navigation',
        page_location: url,
      })
    }
  }

  removeUrlParameters(url: string) {
    return url.split('?')[0]
  }

  private startPerformanceMeasurement(url: string): void {
    if (this.window.performance) {
      this.window.performance.mark(PerformanceMarks.navigationStartPrefix + url)
    }
  }

  private finishPerformanceMeasurement(url: string): number | void {
    if (this.window.performance) {
      this.window.performance.mark(PerformanceMarks.navigationEndPrefix + url)
      let timeForNavigation
      this.window.performance.measure(
        url,
        PerformanceMarks.navigationStartPrefix + url,
        PerformanceMarks.navigationEndPrefix + url
      )
      this.window.performance.getEntriesByName(url).forEach(value => {
        timeForNavigation = value.duration
      })
      this.clearPerformanceMarks(url)
      return timeForNavigation
    }
  }

  private clearPerformanceMarks(url: string) {
    if (this.window.performance) {
      this.window.performance.clearMarks(
        PerformanceMarks.navigationStartPrefix + url
      )
      this.window.performance.clearMarks(
        PerformanceMarks.navigationEndPrefix + url
      )
      this.window.performance.clearMeasures(url)
    }
  }
}
