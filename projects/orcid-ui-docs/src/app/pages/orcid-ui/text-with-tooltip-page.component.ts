import { Component, ChangeDetectionStrategy } from '@angular/core'

import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { TextWithTooltipComponent } from '@orcid/ui'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-text-with-tooltip-page',
  standalone: true,
  imports: [
    FormsModule,
    TextWithTooltipComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DocumentationPageComponent,
  ],
  templateUrl: './text-with-tooltip-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./text-with-tooltip-page.component.scss'],
})
export class TextWithTooltipPageComponent {
  customText =
    'This is a very long text that will definitely overflow its container and show a tooltip when you hover over it'
  containerWidth = 300
}
