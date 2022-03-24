import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MdePopoverModule } from '../cdk/popover'
import { TwoFactorAuthenticationFormModule } from '../cdk/two-factor-authentication-form/two-factor-authentication-form.module'
import { TwoFactorSetupComponent } from './pages/two-factor/two-factor-setup.component'
import { TwoFactorSetupRoutingModule } from './two-factor-setup-routing.module'
import { MatInputModule } from '@angular/material/input'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TwoFactorRecoveryCodesComponent } from './components/two-factor-recovery-codes/two-factor-recovery-codes.component'
import { TwoFactorEnableComponent } from './components/two-factor-enable/two-factor-enable.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

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
