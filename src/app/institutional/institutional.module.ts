import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InstitutionalComponent } from './pages/institutional/institutional.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonModule } from '@angular/material/button'
import { InstitutionalRoutingModule } from './institutional-routing.module'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  declarations: [InstitutionalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    InstitutionalRoutingModule,
    A11yLinkModule,
    MatProgressSpinnerModule,
  ],
})
export class InstitutionalModule {}
