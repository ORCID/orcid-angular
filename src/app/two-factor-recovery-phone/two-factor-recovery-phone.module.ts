import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { OrcidStepViewComponent } from '@orcid/ui'

import { RecoveryPhoneFormComponent } from '../cdk/recovery-phone-form/recovery-phone-form.component'
import { RecoveryPhoneComponent } from './pages/recovery-phone/recovery-phone.component'
import { TwoFactorRecoveryPhoneRoutingModule } from './two-factor-recovery-phone-routing.module'

@NgModule({
  declarations: [RecoveryPhoneComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TwoFactorRecoveryPhoneRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    // Standalone components
    OrcidStepViewComponent,
    RecoveryPhoneFormComponent,
  ],
})
export class TwoFactorRecoveryPhoneModule {}
