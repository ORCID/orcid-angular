import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PasswordRecoveryRoutingModule } from './password-recovery-routing.module'
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module'
import { MatCardModule } from '@angular/material/card'

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
    FormDirectivesModule,
    MatCardModule,
  ],
})
export class PasswordRecoveryModule {}
