import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FormNotificationsComponent } from './components/form-notifications/form-notifications.component'
import { FormPasswordComponent } from './components/form-password/form-password.component'
import { FormPersonalComponent } from './components/form-personal/form-personal.component'
import { FormTermsComponent } from './components/form-terms/form-terms.component'
import { FormVisibilityComponent } from './components/form-visibility/form-visibility.component'
import { StepAComponent } from './components/step-a/step-a.component'
import { StepBComponent } from './components/step-b/step-b.component'
import { StepDComponent } from './components/step-d/step-d.component'
import { RegisterRoutingModule } from './register-routing.module'
// tslint:disable-next-line: max-line-length
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatStepperModule } from '@angular/material/stepper'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module'
import { IsThisYouModule } from '../cdk/is-this-you'
import { MdePopoverModule } from '../cdk/popover'
import { RecaptchaModule } from '../cdk/recaptcha/recaptcha.module'
import { WarningMessageModule } from '../cdk/warning-message/warning-message.module'
import { BackendErrorComponent } from './components/backend-error/backend-error.component'
import { FormAntiRobotsComponent } from './components/form-anti-robots/form-anti-robots.component'
import { FormPersonalAdditionalEmailsComponent } from './components/form-personal-additional-emails/form-personal-additional-emails.component'
import { RegisterComponent } from './pages/register/register.component'
import { StepCComponent } from './components/step-c/step-c.component'
import { FormCurrentEmploymentComponent } from './components/form-current-employment/form-current-employment.component'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { StepC2Component } from './components/step-c2/step-c2.component'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { SharedModule } from '../shared/shared.module'
import { AlertMessageModule } from '../cdk/alert-message/alert-message.module'

@NgModule({
  declarations: [
    StepAComponent,
    StepBComponent,
    StepCComponent,
    StepC2Component,
    StepDComponent,
    FormPersonalComponent,
    FormPasswordComponent,
    FormNotificationsComponent,
    FormVisibilityComponent,
    FormTermsComponent,
    FormPersonalAdditionalEmailsComponent,
    FormAntiRobotsComponent,
    BackendErrorComponent,
    RegisterComponent,
    FormCurrentEmploymentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    AlertMessageModule,
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
    WarningMessageModule,
    MatAutocompleteModule,
    MatLegacySelectModule,
    SharedModule,
  ],
})
export class RegisterModule {}
