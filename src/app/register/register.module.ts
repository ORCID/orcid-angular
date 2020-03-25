import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RegisterRoutingModule } from './register-routing.module'
import { RegisterComponent } from './pages/register/register.component'
import { MatStepperModule } from '@angular/material/stepper'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatInputModule, MatButtonModule } from '@angular/material'
import { StepAComponent } from './components/step-a/step-a.component'
import { StepBComponent } from './components/step-b/step-b.component'
import { StepCComponent } from './components/step-c/step-c.component'
import { FormPersonalComponent } from './components/form-personal/form-personal.component'
import { FormPasswordComponent } from './components/form-password/form-password.component'
import { FormNotificationsComponent } from './components/form-notifications/form-notifications.component'
import { FormVisibilityComponent } from './components/form-visibility/form-visibility.component'
import { FormTermsComponent } from './components/form-terms/form-terms.component'

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
  ],
})
export class RegisterModule {}
