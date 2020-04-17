import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PasswordRecoveryRoutingModule } from './password-recovery-routing.module'
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component'
import {
  MatInputModule,
  MatChipsModule,
  MatButtonModule,
  MatProgressBarModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SnackbarModule } from '../cdk/snackbar/snackbar.module'

@NgModule({
  declarations: [PasswordRecoveryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    PasswordRecoveryRoutingModule,
    MatProgressBarModule,
    SnackbarModule,
  ],
})
export class PasswordRecoveryModule {}
