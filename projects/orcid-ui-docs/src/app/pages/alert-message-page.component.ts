import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatOptionModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { AlertMessageComponent } from '@orcid/ui'

@Component({
  selector: 'orcid-alert-message-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    AlertMessageComponent,
  ],
  styleUrls: ['./alert-message-page.component.scss'],
  templateUrl: './alert-message-page.component.html',
})
export class AlertMessagePageComponent {
  type: 'notice' | 'info' | 'warning' | 'success' = 'notice'
}
