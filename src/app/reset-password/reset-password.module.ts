import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ResetPasswordRoutingModule } from './reset-password-routing.module'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import {
  MatProgressBar,
  MatProgressBarModule,
} from '@angular/material/progress-bar'
import { MatButtonModule } from '@angular/material/button'
import { MdePopoverModule } from '../cdk/popover'
import { FormPasswordComponent } from '../register/components/form-password/form-password.component'
import { RegisterModule } from '../register/register.module'

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
    FormPasswordComponent,
  ],
})
export class ResetPasswordModule {}
