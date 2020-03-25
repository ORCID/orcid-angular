import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RegisterRoutingModule } from './register-routing.module'
import { RegisterComponent } from './pages/register/register.component'
import { MatStepperModule } from '@angular/material/stepper'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatInputModule, MatButtonModule } from '@angular/material'

@NgModule({
  declarations: [RegisterComponent],
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
