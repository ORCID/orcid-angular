import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RegisterRoutingModule } from './register-routing.module'
import { RegisterComponent } from './pages/register/register.component'
import { StepAComponent } from './components/step-a/step-a.component'
import { StepBComponent } from './components/step-b/step-b.component'
import { StepCComponent } from './components/step-c/step-c.component'
import { FormPersonalComponent } from './components/form-personal/form-personal.component'
import { FormPasswordComponent } from './components/form-password/form-password.component'
import { FormNotificationsComponent } from './components/form-notifications/form-notifications.component'
import { FormVisibilityComponent } from './components/form-visibility/form-visibility.component'
import { FormTermsComponent } from './components/form-terms/form-terms.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
// tslint:disable-next-line: max-line-length
import { FormPersonalAdditionalEmailsComponent } from './components/form-personal-additional-emails/form-personal-additional-emails.component'
import { IsThisYouModule } from '../cdk/is-this-you'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogModule } from '@angular/material/dialog'
import { MatStepperModule } from '@angular/material/stepper'
import { MatRadioModule } from '@angular/material/radio'
import { MdePopoverModule } from '@material-extended/mde'
import { MatCardModule } from '@angular/material/card'
import { RecaptchaModule } from '../cdk/recaptcha/recaptcha.module'
import { FormAntiRobotsComponent } from './components/form-anti-robots/form-anti-robots.component'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { BackendErrorComponent } from './components/backend-error/backend-error.component'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module';
import { TopBarRecordIssuesComponent } from './components/top-bar-record-issues/top-bar-record-issues.component'
@NgModule({
  declarations: [
    RegisterComponent,
    StepAComponent,
    StepBComponent,
    StepCComponent,
    FormPersonalComponent,
    FormPasswordComponent,
    FormNotificationsComponent,
    FormVisibilityComponent,
    FormTermsComponent,
    FormPersonalAdditionalEmailsComponent,
    FormAntiRobotsComponent,
    BackendErrorComponent,
    TopBarRecordIssuesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    IsThisYouModule,
    MdePopoverModule,
    MatCardModule,
    RecaptchaModule,
    A11yLinkModule,
    MatProgressBarModule,
    FormDirectivesModule,
  ],
})
export class RegisterModule {}
