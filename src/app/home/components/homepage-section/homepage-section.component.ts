import { Component, Input } from '@angular/core'

import { HeadingLevel, headingId } from '../../heading-level'
import { HomepageSection } from 'src/app/types/homepage-content.v2'
import { AudienceSelectorSectionComponent } from '../../sections/audience-selector/audience-selector-section.component'
import { CtaBandSectionComponent } from '../../sections/cta-band/cta-band-section.component'
import { FeatureListSectionComponent } from '../../sections/feature-list/feature-list-section.component'
import { MediaSectionComponent } from '../../sections/media/media-section.component'
import { NewsFeedSectionComponent } from '../../sections/news-feed/news-feed-section.component'
import { ProseSectionComponent } from '../../sections/prose/prose-section.component'
import { QuickLinksSectionComponent } from '../../sections/quick-links/quick-links-section.component'
import { SectionShellComponent } from '../section-shell/section-shell.component'

/**
 * Render one section: the shared chrome, then the component for its type.
 *
 * `@switch` rather than `*ngSwitchCase` is the one deliberate departure from
 * the older style in this folder. It narrows the discriminated union in the
 * template, so each section component receives its exact type and a field that
 * does not exist on it is a compile error. `*ngSwitchCase` does not narrow, and
 * would need `$any()` at precisely the boundary where a wrong shape would
 * otherwise reach a component.
 *
 * There is no default branch. An unknown type never arrives here because the
 * page drops it while parsing, which is what lets the content repository add a
 * section type before this renderer has heard of it.
 */
@Component({
  selector: 'app-homepage-section',
  templateUrl: './homepage-section.component.html',
  styleUrls: ['./homepage-section.component.scss'],
  standalone: true,
  imports: [
    SectionShellComponent,
    AudienceSelectorSectionComponent,
    MediaSectionComponent,
    FeatureListSectionComponent,
    QuickLinksSectionComponent,
    ProseSectionComponent,
    CtaBandSectionComponent,
    NewsFeedSectionComponent,
  ],
})
export class HomepageSectionComponent {
  @Input({ required: true }) section!: HomepageSection
  /** The level this section's own title takes. Its items go one deeper. */
  @Input({ required: true }) level!: HeadingLevel

  /**
   * The id of this section's heading, when it has one.
   *
   * A section with a title becomes a named landmark; one without stays a plain
   * container, because an unnamed landmark is worse than none — it adds a stop
   * to the landmark list that says nothing about what is in it.
   */
  get labelledBy(): string | undefined {
    const titled = this.section as { title?: string }
    const hidden = (this.section as { titleHidden?: boolean }).titleHidden
    if (!titled.title) return undefined
    // A visually hidden title still names the landmark; that is its job.
    void hidden
    return headingId(this.section.id)
  }
}
