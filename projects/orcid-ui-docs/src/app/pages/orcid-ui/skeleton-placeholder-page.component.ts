import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { SkeletonPlaceholderComponent } from '@orcid/ui'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-skeleton-placeholder-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    SkeletonPlaceholderComponent,
    DocumentationPageComponent,
  ],
  templateUrl: './skeleton-placeholder-page.component.html',
  styles: [
    `
      .example-container {
        padding: 24px;
        border-radius: 4px;
      }
      .example-container.accent {
        background: #003449;
      }
      .example-container.surface {
        background: #fff;
        border: 1px solid #eee;
      }
      .example-caption {
        margin: 0 0 8px;
        font-size: 14px;
        color: #555;
      }
      .examples-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }
      .examples-row .example-container {
        flex: 0 0 auto;
      }
    `,
  ],
})
export class SkeletonPlaceholderPageComponent {
  config = {
    shape: 'square' as 'square' | 'circle',
    width: '100px',
    height: '100px',
    shimmerPercentage: 100,
    accentBackground: true,
  }
}
