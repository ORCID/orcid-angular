import { Injectable, Inject } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/cdk/window'
import { PerformanceMarks } from 'src/app/constants'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

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

  reportError(description: string, fatal = false) {
    console.log({
      description: description,
      fatal: fatal,
    })
    this.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    })
  }

  reportEvent(
    event: string,
    event_category?: string,
    event_label?: string,
    value?: number
  ): Observable<void> {
    return this.eventObservable(event, {
      event_category,
      event_label,
      value,
    }).pipe(
      catchError((err, caught) => {
        console.error(err)
        return caught
      })
    )
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
      this.window.performance.getEntriesByName(url).forEach((value) => {
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

  // see https://medium.com/wizdm-genesys/using-gtag-in-angular-b99a10025fcd
  private eventObservable(
    action: string,
    params?: Gtag.EventParams
  ): Observable<void> {
    // Wraps the event call into a Promise
    return new Observable((observer) => {
      try {
        // Triggers a 3s time-out timer
        const tmr = setTimeout(
          () => observer.error(new Error('gtag call timed-out')),
          3000
        )
        // Performs the event call resolving with the event callback
        this.gtag('event', action, {
          ...params,
          event_callback: () => {
            console.log('EVENT FINISH!')
            clearTimeout(tmr)
            observer.next()
            observer.complete()
          },
        })
      } catch (e) {
        // Rejects the promise on errors
        observer.error(e)
      }
    })
  }
}
