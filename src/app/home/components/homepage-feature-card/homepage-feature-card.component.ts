import { Component, Input } from '@angular/core'

import { HomepageFeature } from 'src/app/types/homepage-content'

@Component({
  selector: 'app-homepage-feature-card',
  templateUrl: './homepage-feature-card.component.html',
  styleUrls: ['./homepage-feature-card.component.scss'],
  standalone: false,
})
export class HomepageFeatureCardComponent {
  @Input() feature!: HomepageFeature
}
