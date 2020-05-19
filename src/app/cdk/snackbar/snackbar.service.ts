import { Injectable } from '@angular/core'
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { SnackbarModule } from './snackbar.module'
import { PlatformInfo, PlatformInfoService } from '../platform-info'
import { take } from 'rxjs/operators'
import { ScreenDirection } from 'src/app/types'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'

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
    title: string,
    message: string,
    error: string,
    analyticsReport: {
      message: string
      fatal: boolean
    } = null
  ) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        title: title,
        message: message,
        error: error,
        contentDirection: this.contentDirection,
      },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: 'bottom',
      panelClass: 'error',
      duration: 10 * 1000,
    })
    if (analyticsReport) {
      this._gtag.reportError(analyticsReport.message, analyticsReport.fatal)
    }
  }
}
