import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MdePopoverModule } from '../cdk/popover'
import { TwoFactorAuthenticationFormModule } from '../cdk/two-factor-authentication-form/two-factor-authentication-form.module'
import { TwoFactorSetupComponent } from './pages/two-factor/two-factor-setup.component'
import { TwoFactorSetupRoutingModule } from './two-factor-setup-routing.module'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { TwoFactorRecoveryCodesComponent } from './components/two-factor-recovery-codes/two-factor-recovery-codes.component'
import { TwoFactorEnableComponent } from './components/two-factor-enable/two-factor-enable.component'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
  declarations: [
    TwoFactorSetupComponent,
    TwoFactorRecoveryCodesComponent,
    TwoFactorEnableComponent,
    TwoFactorEnableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TwoFactorSetupRoutingModule,
    MatProgressBarModule,
    MatCardModule,
    MdePopoverModule,
    MatIconModule,
    MatButtonModule,
    A11yLinkModule,
    MatFormFieldModule,
    TwoFactorAuthenticationFormModule,
    MatInputModule,
    FormDirectivesModule,
    ClipboardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class TwoFactorSetupModule {}
