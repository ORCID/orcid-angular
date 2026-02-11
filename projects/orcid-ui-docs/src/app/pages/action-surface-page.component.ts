import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import {
  ActionSurfaceComponent,
  BrandSecondaryDarkButtonDirective,
  UnderlineButtonDirective,
} from '@orcid/ui'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-action-surface-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ActionSurfaceComponent,
    BrandSecondaryDarkButtonDirective,
    UnderlineButtonDirective,
    DocumentationPageComponent,
  ],
  styleUrls: ['./action-surface-page.component.scss'],
  templateUrl: './action-surface-page.component.html',
})
export class ActionSurfacePageComponent {}
