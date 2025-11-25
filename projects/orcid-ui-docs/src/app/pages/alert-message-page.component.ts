import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatOptionModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { AlertMessageComponent } from '@orcid/ui'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-alert-message-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatIconModule,
    AlertMessageComponent,
    DocumentationPageComponent,
  ],
  styleUrls: ['./alert-message-page.component.scss'],
  templateUrl: './alert-message-page.component.html',
})
export class AlertMessagePageComponent {
  type: 'notice' | 'info' | 'warning' | 'success' = 'notice'
  title = 'Notice example'
  content =
    'This is a <strong>notice</strong> alert. Use it to communicate <em>contextual feedback</em> to the user.'
}
