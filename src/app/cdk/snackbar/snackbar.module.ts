import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SnackbarComponent } from './snackbar/snackbar.component'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'

@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule, MatIconModule, MatSnackBarModule, MatButtonModule],
})
export class SnackbarModule {}
