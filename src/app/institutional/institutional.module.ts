import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InstitutionalComponent } from './pages/institutional/institutional.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { InstitutionalRoutingModule } from './institutional-routing.module'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

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
