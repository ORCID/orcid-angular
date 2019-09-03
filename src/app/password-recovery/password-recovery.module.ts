import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PasswordRecoveryRoutingModule } from './password-recovery-routing.module'
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component'
import { MatInputModule, MatChipsModule } from '@angular/material'
import { MultiRowRaisedButtonModule } from '../cdk/multi-row-raised-button/multi-row-raised-button.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [PasswordRecoveryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatInputModule,
    MultiRowRaisedButtonModule,
    PasswordRecoveryRoutingModule,
  ],
})
export class PasswordRecoveryModule {}
