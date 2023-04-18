import { Inject, Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { RequestInfoForm } from '../../types'
import { BehaviorSubject, Observable } from 'rxjs'
import {
  browserGlobals,
  buildClientString,
  pushOnDataLayer,
  removeUrlParameters,
} from '../../analytics-utils'
import { catchError } from 'rxjs/operators'
import { ItemGTM } from '../../types/item_gtm'
import { ERROR_REPORT } from '../../errors'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { WINDOW } from 'src/app/cdk/window'

@Injectable({
  providedIn: 'root',
})
export class GoogleTagManagerService {
  private _loading = new BehaviorSubject<boolean>(false)
  public readonly loading$ = this._loading.asObservable()

  private isLoaded = false

  constructor(
    private _errorHandler: ErrorHandlerService,
    @Inject(WINDOW) private _window: Window
  ) {}

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
                if (!this.isGtmRunning()) {
                  subscriber.error({
                    name: 'GTM - Error',
                    message: 'Gtm is not adding uniqueEventId attributes',
                  })
                } else {
                  subscriber.next()
                  subscriber.complete()
                }
              }
            },
            () => {
              subscriber.error({
                name: 'GTM - Error',
                message: 'Unable to add GTM',
              })
            }
          )
      } else {
        pushOnDataLayer(item)
        subscriber.next()
        subscriber.complete()
      }
    })
  }

  public isGtmRunning(): boolean {
    // When GTM is blocked by add blockers like Ublock
    // the `gtm.uniqueEventId` will not be added to the dataLayer objects
    const gtmData = (this._window as any).dataLayer || []
    return gtmData.some((event: any) => event['gtm.uniqueEventId'])
  }

  public addGtmToDom(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      if (this.isLoaded) {
        subscriber.next(true)
        subscriber.complete()
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
    let redirectUrl
    if (typeof label !== 'string') {
      clientId = (label as unknown as RequestInfoForm).clientId
      redirectUrl = (label as unknown as RequestInfoForm).redirectUrl
      label = 'OAuth ' + buildClientString(label)
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

    if (event === 'Reauthorize') {
      tagItem.redirectUrl = redirectUrl
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
