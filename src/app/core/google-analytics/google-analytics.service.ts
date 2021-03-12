import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { WINDOW } from 'src/app/cdk/window'
import { PerformanceMarks } from 'src/app/constants'
import { RequestInfoForm } from 'src/app/types'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gtag: Gtag.Gtag
  constructor(@Inject(WINDOW) private window: Window) {
    this.gtag = (window as any).gtag
  }

  reportPageView(url: string) {
    if (environment.debugger) {
      console.info(`GA - Navigation ${url}`)
    }
    this.gtag('config', environment.GOOGLE_ANALYTICS, {
      cookie_flags: 'SameSite=None;Secure',
      page_path: url,
      page_location: window.location.href,
      anonymize_ip: true,
      sample_rate: '100',
      site_speed_sample_rate: environment.GOOGLE_ANALYTICS_TESTING_MODE
        ? '100'
        : '1',
    })
  }

  reportNavigationStart(url: string) {
    this.startPerformanceMeasurement(url)
  }

  reportNavigationEnd(url: string) {
    const duration = this.finishPerformanceMeasurement(url)
    if (duration) {
      if (environment.debugger) {
        console.info(`GA - Took ${duration} to load ${url}`)
      }
      this.gtag('event', 'timing_complete', {
        name: this.removeUrlParameters(url),
        value: Math.round(duration),
        event_category: 'angular_navigation',
        page_location: url,
      })
    }
  }

  reportError(description: string, fatal = false) {
    console.error(`
__Report error GA__
description: "${description}"
fatal: "${fatal}"
    `)

    this.gtag('event', 'exception', {
      description,
      fatal,
    })
  }

  public reportEvent(
    action: string,
    event_category: string,
    event_label: RequestInfoForm | string
  ): Observable<void> {
    // if has RequestInfoForm add the client string as event_label
    if (typeof event_label !== 'string') {
      event_label = 'OAuth ' + this.buildClientString(event_label)
    }
    if (environment.debugger) {
      console.info(`GA - Event ${action}/${event_category}/${event_label}/`)
    }
    return this.eventObservable(action, {
      event_category,
      event_label,
    })
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

  buildClientString(request: RequestInfoForm) {
    return request.memberName + ' - ' + request.clientName
  }
}
