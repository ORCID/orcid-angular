import { Component, Input } from '@angular/core'

import {
  HomepageContent,
  HomepageSection,
  isRenderableSection,
} from 'src/app/types/homepage-content.v2'
import { HeadingComponent } from '../heading/heading.component'
import { HomepageSectionsComponent } from '../homepage-sections/homepage-sections.component'

/**
 * The whole homepage, from one content document.
 *
 * This is the only place the page is composed. The live route and the content
 * editor's preview both render this component and nothing else, so the preview
 * is structurally the same page a visitor gets — heading order, landmarks and
 * all — rather than a second implementation that drifts.
 *
 * The page title is a required field rather than a section type, which is what
 * makes the single h1 structural: it cannot be deleted, duplicated or moved
 * below something else, and every section heading is computed relative to it.
 */
@Component({
  selector: 'app-homepage-page',
  templateUrl: './homepage-page.component.html',
  styleUrls: ['./homepage-page.component.scss'],
  standalone: true,
  imports: [HeadingComponent, HomepageSectionsComponent],
})
export class HomepagePageComponent {
  title = ''
  sections: HomepageSection[] = []
  /** Sections this build could not render, reported to the editor's preview. */
  skipped: string[] = []

  @Input({ required: true }) set content(value: HomepageContent | undefined) {
    this.title = value?.page?.title ?? ''

    const all = value?.sections ?? []
    // Each section is judged on its own. A section this build does not know
    // about, or one that is malformed, costs its own block rather than the
    // whole page — which is what lets the content repository publish a new
    // section type before this renderer has been released.
    this.sections = all.filter((section) => isRenderableSection(section))
    this.skipped = all
      .filter((section) => !isRenderableSection(section))
      .map((section, index) => {
        const named = section as { id?: string; type?: string }
        return named.id ?? named.type ?? `section ${index + 1}`
      })
  }
}
