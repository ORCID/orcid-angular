import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule, MatIconModule, MatSnackBarModule, MatButtonModule],
  entryComponents: [SnackbarComponent],
})
export class SnackbarModule {}
