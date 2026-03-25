import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, throwError } from 'rxjs'
import { catchError, switchMap, take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { ErrorReport } from 'src/app/types'
import { ERROR_REPORT } from 'src/app/errors'
import { CookieService } from 'ngx-cookie-service'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { AppEventName } from 'src/app/register/app-event-names'

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  browserSupport = 'unchecked'
  constructor(
    private _cookie: CookieService,
    private _platform: PlatformInfoService,
    private _snackBar: SnackbarService,
    private _observability: RumJourneyEventService
  ) {
    this.checkBrowser()
  }
  public handleError(
    error: Error | HttpErrorResponse,
    errorReport: ErrorReport = ERROR_REPORT.STANDARD_NO_VERBOSE
  ) {
    return of({})
      .pipe(
        switchMap(() => {
          const platformDetails = this.browserSupport + this.checkCSRF()

          if (error instanceof HttpErrorResponse) {
            const split = error.url.split('/')
            const url = split[split.length - 1]

            return throwError({
              ...error,
              message: `${error.status}/${error.name}/${platformDetails}/${url}`,
            })
          } else {
            return throwError({
              ...error,
              message: `${error.name}'/'${error.message}/${platformDetails}`,
            })
          }
        })
      )
      .pipe(
        catchError((processedError: Error | HttpErrorResponse) => {
          // Server / transport error (includes plain objects from spread HttpErrorResponse above)
          const httpLike =
            processedError instanceof HttpErrorResponse ||
            (processedError !== null &&
              typeof processedError === 'object' &&
              typeof (processedError as HttpErrorResponse).status ===
                'number' &&
              'url' in (processedError as object))

          if (httpLike) {
            const http = processedError as HttpErrorResponse
            try {
              this._observability.recordSimpleEvent(AppEventName.HttpError, {
                status: http.status,
                statusText: http.statusText,
                url: http.url,
                name: http.name,
                browserSupport: this.browserSupport,
                csrf: this.checkCSRF(),
              })
            } catch (_) {}
            console.error(
              `
__Server error__
(status:${http.status} (${http.statusText}) url: ${http.url})
name: "${http.name}"
message: "${http.message}"
ok: "${http.ok}"
            `
            )
          } else {
            // Client side error
            try {
              this._observability.recordSimpleEvent(AppEventName.ClientError, {
                name: processedError.name,
                message: processedError.message,
                browserSupport: this.browserSupport,
                csrf: this.checkCSRF(),
              })
            } catch (_) {}
            console.error(
              `
__Local error__
(name:${processedError.name})
message: "${processedError.message}"
stack: "${processedError.stack}"
            `
            )
          }

          this._snackBar.showErrorMessage(processedError, errorReport)
          return throwError(() => processedError)
        })
      )
  }

  public xml2jsParser(error) {
    console.error(error)
  }

  private checkBrowser() {
    this._platform
      .get()
      .pipe(take(1))
      .subscribe((val) => {
        this.browserSupport = val.unsupportedBrowser ? 'unsupported' : ''
      })
  }

  private checkCSRF() {
    if (!this._cookie.get('XSRF-TOKEN')) {
      return 'no-XSRF'
    } else {
      return ''
    }
  }
}
