import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SkeletonPlaceholderComponent } from '@orcid/ui';
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component';

@Component({
    selector: 'orcid-skeleton-placeholder-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SkeletonPlaceholderComponent,
        DocumentationPageComponent
    ],
    templateUrl: './skeleton-placeholder-page.component.html',
    styles: [`
    .example-container {
      padding: 24px;
      background: #003449; /* Dark background to see the placeholder */
      border-radius: 4px;
    }
  `]
})
export class SkeletonPlaceholderPageComponent {
    config = {
        shape: 'square' as 'square' | 'circle',
        width: '100px',
        height: '100px'
    };
}
