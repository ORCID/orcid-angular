import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { SignInModule } from '../sign-in/sign-in.module'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MdePopoverModule } from '../cdk/popover'
import { TwoFactorAuthenticationFormModule } from '../cdk/two-factor-authentication-form/two-factor-authentication-form.module'
import { TwoFactorComponent } from './pages/two-factor/two-factor.component'
import { TwoFactorRoutingModule } from './two-factor-routing.module'

@NgModule({
  declarations: [TwoFactorComponent],
  imports: [
    CommonModule,
    TwoFactorRoutingModule,
    MatProgressBarModule,
    MatCardModule,
    MdePopoverModule,
    MatIconModule,
    MatButtonModule,
    A11yLinkModule,
    MatFormFieldModule,
    TwoFactorAuthenticationFormModule,
  ],
})
export class TwoFactorModule {}
