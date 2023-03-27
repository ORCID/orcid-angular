import { Injectable } from '@angular/core'
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar'
import { take } from 'rxjs/operators'
import { GoogleUniversalAnalyticsService } from 'src/app/core/google-analytics/google-universal-analytics.service'
import { DisplayMessage, ErrorReport, ScreenDirection } from 'src/app/types'

import { PlatformInfoService } from '../platform-info'
import { SnackbarModule } from './snackbar.module'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { HttpErrorResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: SnackbarModule,
})
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right'
  contentDirection: ScreenDirection = 'ltr'
  constructor(
    private _snackBar: MatSnackBar,
    _platform: PlatformInfoService,
    private _gtag: GoogleUniversalAnalyticsService
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
    error: Error | HttpErrorResponse,
    errorReport?: ErrorReport
  ) {
    let mappedDisplay: DisplayMessage
    if (
      errorReport?.display &&
      (!errorReport.display.displayOnlyOnVerboseEnvironment ||
        environment.VERBOSE_SNACKBAR_ERRORS_REPORTS)
    ) {
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
          displayMessage: mappedDisplay,
          caption: error.message,
        },
        horizontalPosition: this.horizontalPosition,
        verticalPosition: 'bottom',
        panelClass: 'orcid-error',
        duration: 10 * 1000,
      })
    }

    if (errorReport?.analytics) {
      this._gtag.reportError(
        `${errorReport.analytics.code}/${error.message}`.replace(/ /g, ''),
        errorReport.analytics.fatal
      )
    }
  }

  showValidationError(
    message: string = $localize`:@@shared.pleaseReviewInvalidForm:Please review the form and fix the issues before saving`,
    title: string = $localize`:@@shared.invalidForm:Form validation error`
  ) {
    const mappedDisplay = {
      contentDirection: this.contentDirection,
      closable: true,
      title,
      message,
    }

    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        displayMessage: mappedDisplay,
      },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: 'bottom',
      panelClass: 'orcid-error',
      duration: 15 * 1000,
    })
  }

  showSuccessMessage(message: DisplayMessage) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        displayMessage: message,
      },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: 'bottom',
      panelClass: 'orcid-success',
      duration: (!message.closable ? 15 : 90) * 1000,
    })
  }
}
