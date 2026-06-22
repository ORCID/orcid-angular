import { Component, ChangeDetectionStrategy } from '@angular/core'

import { MatButtonModule } from '@angular/material/button'
import {
  ActionSurfaceComponent,
  BrandSecondaryDarkButtonDirective,
  UnderlineButtonDirective,
} from '@orcid/ui'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-action-surface-page',
  standalone: true,
  imports: [
    MatButtonModule,
    ActionSurfaceComponent,
    BrandSecondaryDarkButtonDirective,
    UnderlineButtonDirective,
    DocumentationPageComponent,
  ],
  styleUrls: ['./action-surface-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './action-surface-page.component.html',
})
export class ActionSurfacePageComponent {}
