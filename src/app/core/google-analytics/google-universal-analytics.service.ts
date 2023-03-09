import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { RequestInfoForm } from 'src/app/types'
import { environment } from 'src/environments/environment'
import {
  buildClientString,
  pushOnDataLayer,
  removeUrlParameters,
} from '../../analytics-utils'
import { ItemGTM } from '../../types/item_gtm'

@Injectable({
  providedIn: 'root',
})
export class GoogleUniversalAnalyticsService {
  constructor() {}

  reportPageView(url: string) {
    if (environment.debugger) {
      console.debug(`GA - Navigation ${url}`)
    }

    const item: ItemGTM = {
      event: 'pageview',
      page: {
        path: url,
        location: window.location.href,
      },
    }

    return this.pushTag(item).subscribe()
  }

  reportNavigationEnd(url: string, duration: number | void): Observable<void> {
    if (duration) {
      if (environment.debugger) {
        console.debug(`GA - Took ${duration} to load ${url}`)
      }

      const item: ItemGTM = {
        event: 'timing_complete',
        eventProps: {
          name: removeUrlParameters(url),
          value: Math.round(duration),
          category: 'angular_navigation',
          page_location: url,
        },
      }

      return this.pushTag(item)
    }
  }

  reportError(description: string, fatal = false) {
    console.error(`
__Report error GA__
description: "${description}"
fatal: "${fatal}"
    `)
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

    const item: ItemGTM = {
      event: 'event',
      eventProps: {
        category: event_category,
        action: action,
        label: event_label,
      },
    }

    if(environment.GOOGLE_TAG_MANAGER)

    return this.pushTag(item)
  }

  public pushTag(item: ItemGTM): Observable<void> {
    return new Observable<void>((subscriber) => {
      pushOnDataLayer(item)
      subscriber.next()
      subscriber.complete()
    })
  }
}
