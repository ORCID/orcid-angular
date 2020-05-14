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

@Injectable({
  providedIn: SnackbarModule,
})
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right'
  contentDirection: ScreenDirection = 'ltr'
  constructor(private _snackBar: MatSnackBar, _platform: PlatformInfoService) {
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

  showErrorMessage(title: string, message: string, error: string) {
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
  }
}
