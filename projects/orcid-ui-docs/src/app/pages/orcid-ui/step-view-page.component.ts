import { Component, ChangeDetectionStrategy } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { OrcidStepViewComponent } from '@orcid/ui'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-step-view-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    OrcidStepViewComponent,
    DocumentationPageComponent,
  ],
  templateUrl: './step-view-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./step-view-page.component.scss'],
})
export class StepViewPageComponent {
  config = {
    title: 'Enable two-factor authentication',
    subtitle: 'Step 1 of 2 - Authentication app',
    primaryLabel: 'Next step - 2FA recovery codes',
    primaryDisabled: false,
    fullWidthActions: true,
  }
}
