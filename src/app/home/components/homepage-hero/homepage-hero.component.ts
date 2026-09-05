import { Component, Input } from '@angular/core'

import { HomepageAudience } from 'src/app/types/homepage-content'

/**
 * The tabbed hero: one tab per audience, each with an intro and two features
 * over a shared background image.
 *
 * Tab bodies are lazy templates, so only the selected audience's images are
 * requested. On the current page every tab's markup is in the document at once.
 */
@Component({
  selector: 'app-homepage-hero',
  templateUrl: './homepage-hero.component.html',
  styleUrls: [
    './homepage-hero.component.scss-theme.scss',
    './homepage-hero.component.scss',
  ],
  standalone: false,
})
export class HomepageHeroComponent {
  @Input() title = ''
  @Input() audiences: HomepageAudience[] = []
}
