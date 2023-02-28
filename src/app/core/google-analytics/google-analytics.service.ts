import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { WINDOW } from 'src/app/cdk/window'
import { RequestInfoForm } from 'src/app/types'
import { environment } from 'src/environments/environment'
// @ts-ignore
import Gtag from 'gtag.js'
import { buildClientString, removeUrlParameters } from '../../analytics-utils'

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gtag: Gtag
  constructor(@Inject(WINDOW) private window: Window) {
    this.gtag = (window as any).gtag
  }

  reportPageView(url: string) {
    if (environment.debugger) {
      console.debug(`GA - Navigation ${url}`)
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

  reportNavigationEnd(url: string, duration: number | void) {
    if (duration) {
      if (environment.debugger) {
        console.debug(`GA - Took ${duration} to load ${url}`)
      }
      this.gtag('event', 'timing_complete', {
        name: removeUrlParameters(url),
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
      event_label = 'OAuth ' + buildClientString(event_label)
    }
    if (environment.debugger) {
      console.debug(`GA - Event /${event_category}/${action}/${event_label}/`)
    }
    return this.eventObservable(action, {
      event_category,
      event_label,
    })
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
}
