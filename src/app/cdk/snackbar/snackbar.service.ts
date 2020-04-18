import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { SnackbarModule } from './snackbar.module'

@Injectable({
  providedIn: SnackbarModule,
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  showErrorMessage(title: string, message: string, error: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        title: title,
        message: message,
        error: error,
      },
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'error',
      duration: 5 * 1000,
    })
  }
}
