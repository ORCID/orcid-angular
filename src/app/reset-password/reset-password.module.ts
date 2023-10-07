import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ResetPasswordRoutingModule } from './reset-password-routing.module'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import {
  MatLegacyProgressBar as MatProgressBar,
  MatLegacyProgressBarModule as MatProgressBarModule,
} from '@angular/material/legacy-progress-bar'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MdePopoverModule } from '../cdk/popover'

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MdePopoverModule,
  ],
})
export class ResetPasswordModule {}
