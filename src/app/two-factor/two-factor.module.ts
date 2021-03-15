import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TwoFactorComponent } from './pages/two-factor/two-factor.component'
import { TwoFactorRoutingModule } from './two-factor-routing.module'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCardModule } from '@angular/material/card'
import { SignInModule } from '../sign-in/sign-in.module'
import { MdePopoverModule } from '@material-extended/mde'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatFormFieldModule } from '@angular/material/form-field'

@NgModule({
  declarations: [TwoFactorComponent],
  imports: [
    CommonModule,
    TwoFactorRoutingModule,
    SignInModule,
    MatProgressBarModule,
    MatCardModule,
    MdePopoverModule,
    MatIconModule,
    MatButtonModule,
    A11yLinkModule,
    MatFormFieldModule,
  ],
})
export class TwoFactorModule {}
