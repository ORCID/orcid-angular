import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import {
  ActionSurfaceComponent,
  ActionSurfaceContainerComponent,
  BrandSecondaryDarkButtonDirective,
  UnderlineButtonDirective,
} from '@orcid/ui'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-action-surface-container-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ActionSurfaceComponent,
    ActionSurfaceContainerComponent,
    BrandSecondaryDarkButtonDirective,
    UnderlineButtonDirective,
    DocumentationPageComponent,
  ],
  styleUrls: ['./action-surface-container-page.component.scss'],
  templateUrl: './action-surface-container-page.component.html',
})
export class ActionSurfaceContainerPageComponent {
  title = 'Unread permission notifications'
  subtitle = 'You have 3 updates waiting for your review.'
}
