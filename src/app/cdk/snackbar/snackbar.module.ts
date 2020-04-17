import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { MatIconModule, MatSnackBarModule } from '@angular/material'

@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  entryComponents: [SnackbarComponent],
})
export class SnackbarModule {}
