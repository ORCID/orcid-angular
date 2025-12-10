import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { OrcidPanelComponent } from '@orcid/ui'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-panel-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrcidPanelComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    DocumentationPageComponent,
  ],
  templateUrl: './panel-page.component.html',
  styleUrls: ['./panel-page.component.scss'],
})
export class PanelPageComponent {
  config = {
    title: 'Employment',
    icon: 'work',
    content:
      '<div>University of Example, Research Scientist</div>\n<div>2020 - Present</div>',
    footerText: 'Source: Self-asserted',
    isMobile: false,
    isPreferred: false,
    startToggleOn: false,
    enableStartToggl: false,
    startToggleDisabled: false,
    startToggleTooltip: 'Click to highlight this affiliation',
    hasExternalIds: false,
    userVersionPresent: false,
    showContent: true,
  }

  iconOptions = [
    { value: '', label: 'None' },
    { value: 'work', label: 'work' },
    { value: 'school', label: 'school' },
    { value: 'volunteer_activism', label: 'volunteer_activism' },
    { value: 'volunteer_activism', label: 'volunteer_activism' },
    { value: 'military_tech', label: 'military_tech' },
    { value: 'fitness_center', label: 'fitness_center' },
    { value: 'local_hospital', label: 'local_hospital' },
  ]

  onToggleFeatured() {
    console.log('Toggle button pressed')
  }
}
