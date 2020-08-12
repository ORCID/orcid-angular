import { Injectable } from '@angular/core'
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar'
import { take } from 'rxjs/operators'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { ErrorDisplay, ErrorReport, ScreenDirection } from 'src/app/types'

import { PlatformInfoService } from '../platform-info'
import { SnackbarModule } from './snackbar.module'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { HttpErrorResponse } from '@angular/common/http'

@Injectable({
  providedIn: SnackbarModule,
})
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right'
  contentDirection: ScreenDirection = 'ltr'
  constructor(
    private _snackBar: MatSnackBar,
    _platform: PlatformInfoService,
    private _gtag: GoogleAnalyticsService
  ) {
    _platform
      .get()
      .pipe(take(1))
      .subscribe((value) => {
        if (value.rtl) {
          this.horizontalPosition = 'left'
          this.contentDirection = 'rtl'
        }
      })
  }

  showErrorMessage(
    error: { error: Error | HttpErrorResponse; message: string },
    errorReport: ErrorReport
  ) {
    let mappedDisplay: ErrorDisplay
    if (errorReport?.display) {
      mappedDisplay = {
        ...errorReport.display,
        contentDirection:
          errorReport.display.contentDirection || this.contentDirection,
        closable:
          typeof errorReport.display.closable !== 'undefined'
            ? errorReport.display.closable
            : false,
      }
      this._snackBar.openFromComponent(SnackbarComponent, {
        data: {
          errorDisplay: mappedDisplay,
          error: error.message,
        },
        horizontalPosition: this.horizontalPosition,
        verticalPosition: 'bottom',
        panelClass: 'orcid-error',
        duration: 10 * 1000,
      })
    }

    if (errorReport?.analytics) {
      let url = '/'
      console.log(error)
      if (error.error instanceof HttpErrorResponse) {
        const split = error.error.url.split('/')
        url += split[split.length - 1]
      }
      this._gtag.reportError(
        (errorReport.analytics.code + error.message + url).replace(/ /g, ''),
        errorReport.analytics.fatal
      )
    }
  }
}
