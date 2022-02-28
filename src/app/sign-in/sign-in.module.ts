import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignInRoutingModule } from './sign-in-routing.module'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SocialComponent } from './components/social/social.component'
import { DeactivatedComponent } from './components/errors/deactivated/deactivated.component'
import { LoggedInComponent } from './components/logged-in/logged-in.component'
import { PrintErrorsComponent } from './components/errors/print-errors/print-errors.component'
import { FormSignInComponent } from './components/form-sign-in/form-sign-in.component'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MyOrcidAlertsModule } from '../cdk/my-orcid-alerts/my-orcid-alerts.module'
import { TwoFactorAuthenticationFormModule } from '../cdk/two-factor-authentication-form/two-factor-authentication-form.module'

@NgModule({
  declarations: [
    SignInComponent,
    SocialComponent,
    DeactivatedComponent,
    LoggedInComponent,
    PrintErrorsComponent,
    FormSignInComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    SignInRoutingModule,
    FormDirectivesModule,
    A11yLinkModule,
    MyOrcidAlertsModule,
    TwoFactorAuthenticationFormModule,
  ],
  exports: [FormSignInComponent],
})
export class SignInModule {}
