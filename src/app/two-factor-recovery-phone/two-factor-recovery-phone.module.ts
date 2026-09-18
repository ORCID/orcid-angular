import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import IntlTelInput from '@intl-tel-input/angular'
import { AlertMessageComponent, OrcidStepViewComponent } from '@orcid/ui'

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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    IntlTelInput,
    AlertMessageComponent,
    OrcidStepViewComponent,
  ],
})
export class TwoFactorRecoveryPhoneModule {}
