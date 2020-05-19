import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { SnackbarModule } from './snackbar.module'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'

@Injectable({
  providedIn: SnackbarModule,
})
export class SnackbarService {
  constructor(
    private _snackBar: MatSnackBar,
    private _gtag: GoogleAnalyticsService
  ) {}

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
      },
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'error',
      duration: 10 * 1000,
    })
    if (analyticsReport) {
      this._gtag.reportError(analyticsReport.message, analyticsReport.fatal)
    }
  }
}
