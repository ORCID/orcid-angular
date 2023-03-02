import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { RequestInfoForm } from '../../types'
import { BehaviorSubject, fromEvent, Observable, of, throwError } from 'rxjs'
import {
  browserGlobals,
  buildClientString,
  finishPerformanceMeasurement,
  pushOnDataLayer,
  removeUrlParameters,
  startPerformanceMeasurement,
} from '../../analytics-utils'
import { catchError, first, map } from 'rxjs/operators'
import { ItemGTM } from '../../types/item_gtm'
import { ERROR_REPORT } from '../../errors'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class GoogleTagManagerService {
  private _loading = new BehaviorSubject<boolean>(false)
  public readonly loading$ = this._loading.asObservable()

  private isLoaded = false

  constructor(private _errorHandler: ErrorHandlerService) {}

  public pushTag(item: ItemGTM): Observable<void> {
    return new Observable<void>((subscriber) => {
      if (!this.isLoaded) {
        this.addGtmToDom()
          .pipe(
            catchError((err) =>
              this._errorHandler.handleError(
                err,
                ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
              )
            )
          )
          .subscribe(
            (response) => {
              if (response) {
                pushOnDataLayer(item)
                subscriber.next()
                subscriber.complete()
              }
            },
            (error) => console.log('GTM error')
          )
      } else {
        pushOnDataLayer(item)
        subscriber.next()
        subscriber.complete()
      }
    })
  }

  public addGtmToDom(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      if (this.isLoaded) {
        subscriber.next(true)
      }
      const doc = browserGlobals.documentRef()
      pushOnDataLayer({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      })

      const gtmScript = doc.createElement('script')
      gtmScript.id = 'GTM'
      gtmScript.async = true
      gtmScript.src =
        'https://www.googletagmanager.com/gtm.js?id=' +
        environment.GOOGLE_TAG_MANAGER
      gtmScript.addEventListener('load', () => {
        this.isLoaded = true
        subscriber.next(true)
        subscriber.complete()
      })
      gtmScript.addEventListener('error', () => {
        subscriber.error({
          name: 'GTM - Error',
          message: 'Unable to add GTM',
        })
      })
      doc.head.insertBefore(gtmScript, doc.head.firstChild)
    })
  }

  reportPageView(url: string) {
    if (environment.debugger) {
      console.debug(`GTM Navigation ${url}`)
    }
    const gtmTag: ItemGTM = {
      event: 'page',
      pageName: url,
    }
    this.pushTag(gtmTag).subscribe()
  }

  public reportEvent(
    event: string,
    label: RequestInfoForm | string
  ): Observable<void> {
    let clientId
    // if has RequestInfoForm add the client string as event_label
    if (typeof label !== 'string') {
      label = 'OAuth ' + buildClientString(label)
      clientId = (label as unknown as RequestInfoForm).clientId
    }
    if (environment.debugger) {
      console.debug(`GTM - Event /${event}/${label}/`)
    }

    let tagItem = {
      event,
      label,
    } as ItemGTM
    if (clientId) {
      tagItem.clientId = clientId
    }

    return this.pushTag(tagItem)
  }

  reportNavigationEnd(url: string, duration: number | void): Observable<void> {
    if (duration) {
      if (environment.debugger) {
        console.debug(`GTM - Took ${duration} to load ${url}`)
      }

      return this.pushTag({
        event: 'timing_complete',
        orcid: removeUrlParameters(url),
        duration: Math.round(duration),
        pageName: url,
      })
    }
  }
}
