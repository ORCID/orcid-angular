import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatRadioModule } from '@angular/material/radio'
import IntlTelInput from '@intl-tel-input/angular'
import { AlertMessageComponent } from '@orcid/ui'

import { SmsPocRoutingModule } from './sms-poc-routing.module'
import { SmsPocComponent } from './pages/sms-poc/sms-poc.component'

@NgModule({
  declarations: [SmsPocComponent],
  imports: [
    AlertMessageComponent,
    CommonModule,
    IntlTelInput,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
    ReactiveFormsModule,
    SmsPocRoutingModule,
  ],
})
export class SmsPocModule {}
