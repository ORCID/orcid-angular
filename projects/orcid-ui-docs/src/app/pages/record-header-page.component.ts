import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AccentButtonDirective, HeaderBannerComponent } from '@orcid/ui'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-record-header-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderBannerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    AccentButtonDirective,
    DocumentationPageComponent,
  ],
  styleUrls: ['./record-header-page.component.scss'],
  templateUrl: './record-header-page.component.html',
})
export class RecordHeaderPageComponent {
  config = {
    title: 'Dr. Jane Doe',
    subtitle: 'Jane D.; J. Doe',
    primaryIdText: '0000-0001-2345-6789',
    secondaryIdText: 'https://orcid.org/0000-0001-2345-6789',
    showSubtitle: true,
    canToggleExpanded: true,
    expanded: false,
    loading: false,
    regionNames: 'Names',
    regionOrcidId: 'Orcid iD',
    issueBannerText: 'This record has been deactivated',
  }
}
