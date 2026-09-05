import { Component, Input } from '@angular/core'

import { HomepageIntegrate } from 'src/app/types/homepage-content'

@Component({
  selector: 'app-homepage-integrate',
  templateUrl: './homepage-integrate.component.html',
  styleUrls: ['./homepage-integrate.component.scss'],
  standalone: false,
})
export class HomepageIntegrateComponent {
  @Input() integrate!: HomepageIntegrate
}
