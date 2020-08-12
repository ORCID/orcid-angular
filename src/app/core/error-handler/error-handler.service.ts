import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { of, throwError } from 'rxjs'
import { take } from 'rxjs/internal/operators/take'
import { catchError, switchMap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { ErrorReport } from 'src/app/types'

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  browserSupport = 'unchecked'
  constructor(
    private _platform: PlatformInfoService,
    private _cookie: CookieService,
    private _snackBar: SnackbarService
  ) {
    this.checkBrowser()
  }
  public handleError(
    error: Error | HttpErrorResponse,
    errorReport: ErrorReport
  ) {
    return of({})
      .pipe(
        switchMap(() => {
          const platformDetails = this.browserSupport + this.checkCSRF()

          if (error instanceof HttpErrorResponse) {
            // Server error
            console.error(
              `
  __Server error__
  (status:${error.status} (${error.statusText}) url: ${error.url})
  name: "${error.name}"
  message: "${error.message}"
  ok: "${error.ok}"
  platform"${platformDetails}
  `
            )
            return throwError({
              error: error,
              message: `${error.status} (${error.statusText}) ${platformDetails}`,
            })
          } else {
            // Client side error
            console.error(
              `
  __Local error__
  (name:${error.name})
  message: "${error.message}"
  stack: "${error.stack}"
  platform"${platformDetails}
  `
            )
            return throwError({
              error: error,
              message: error.name + platformDetails,
            })
          }
        })
      )
      .pipe(
        catchError(
          (processedError: {
            error: Error | HttpErrorResponse
            message: string
          }) => {
            console.log(processedError)
            this._snackBar.showErrorMessage(processedError, errorReport)
            return throwError(processedError)
          }
        )
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
        this.browserSupport = val.unsupportedBrowser ? '/unsupported' : ''
      })
  }

  private checkCSRF() {
    if (!this._cookie.get('XSRF-TOKEN')) {
      return '/no-XSRF'
    } else {
      return ''
    }
  }
}
