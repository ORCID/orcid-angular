import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, throwError } from 'rxjs'
import { catchError, switchMap, take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { ErrorReport } from 'src/app/types'
import { ERROR_REPORT } from 'src/app/errors'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  browserSupport = 'unchecked'
  constructor(
    private _cookie: CookieService,
    private _platform: PlatformInfoService,
    private _snackBar: SnackbarService
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
          // Server error
          if (processedError instanceof HttpErrorResponse) {
            console.error(
              `
__Server error__
(status:${processedError.status} (${processedError.statusText}) url: ${processedError.url})
name: "${processedError.name}"
message: "${processedError.message}"
ok: "${processedError.ok}"
            `
            )
          } else {
            // Client side error
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
          return throwError(processedError)
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
