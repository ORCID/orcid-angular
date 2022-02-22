import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { TwoFactorAuthenticationFormComponent } from './two-factor/two-factor-authentication-form.component'

@NgModule({
  declarations: [TwoFactorAuthenticationFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  exports: [TwoFactorAuthenticationFormComponent],
})
export class TwoFactorAuthenticationFormModule {}
