import { Component, Input } from '@angular/core'

import {
  FeatureItem,
  FeatureListSection,
  FeatureListVariant,
  VARIANTS,
} from '../../../types/homepage-content.v2'
import { ContentImageComponent } from '../../components/content-image/content-image.component'
import { HeadingComponent } from '../../components/heading/heading.component'
import {
  isExternalHref,
  RichTextComponent,
} from '../../components/rich-text/rich-text.component'
import {
  HeadingLevel,
  SECTION_HEADING_LEVEL,
  headingId,
  nextLevel,
} from '../../heading-level'

/**
 * The variant used when the bundle names one this build does not know.
 *
 * D4 says a renderer falls back to a type's first variant rather than dropping
 * the section, so a catalogue that adds a fifth variant is an additive change
 * and not a coordinated two-repo release. The list is read from the contract
 * instead of being retyped, so the fallback cannot drift from the catalogue.
 */
const KNOWN_VARIANTS = VARIANTS['feature-list'] as readonly FeatureListVariant[]
const FALLBACK_VARIANT: FeatureListVariant = KNOWN_VARIANTS[0]

/** The catalogue's default when `columns` is absent (spec-v2 1.3). */
const DEFAULT_COLUMNS: 2 | 3 = 3

/**
 * `feature-list` — a heading plus repeating headed points (spec-v2 1.3).
 *
 * This replaces two different things at once: the feature cards that used to be
 * welded inside the hero, and the `integrate` section, whose `paragraphs[]`
 * could not express a sub-heading at all. Its item type, `feature-item`, is the
 * same one `audience-selector` renders in its `features` list — that sharing is
 * the composability the catalogue exists for, so the two must stay one shape.
 *
 * All four variants are one template plus CSS (spec-v2 4.5). The DOM, the
 * heading outline and the links are identical in every variant; only the
 * arrangement changes. A variant that changed the DOM would let a purely
 * visual choice in the CMS change what a screen reader hears.
 *
 * The section landmark, tone and spacing are NOT here: `app-section-shell`
 * supplies them, and the page component wraps this. Wrapping again would emit a
 * second, unnamed `<section>`, which some screen readers announce as an empty
 * region the reader has to step through.
 */
@Component({
  selector: 'app-feature-list-section',
  standalone: true,
  imports: [ContentImageComponent, HeadingComponent, RichTextComponent],
  templateUrl: './feature-list-section.component.html',
  styleUrls: ['./feature-list-section.component.scss'],
})
export class FeatureListSectionComponent {
  @Input({ required: true }) section!: FeatureListSection

  /**
   * The level this section's own title takes. Computed by the host from the
   * section's position, never authored — the catalogue has no `level` field and
   * the meta-schema forbids one being added (D3).
   */
  @Input({ required: true }) headingLevel: HeadingLevel = SECTION_HEADING_LEVEL

  /** Part of the anchor's accessible name, so it is never punctuation alone. */
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`

  /**
   * A title made only of whitespace is not a title. Treating it as one would
   * emit an empty heading and, worse, push every item heading down a level for
   * nothing.
   */
  get hasTitle(): boolean {
    return (this.section.title ?? '').trim() !== ''
  }

  get titleId(): string {
    return headingId(this.section.id)
  }

  /**
   * One level below the section title when there is one, the same level when
   * there is not. `nextLevel` owns that arithmetic so an untitled section
   * promotes its items instead of leaving a gap in the outline.
   */
  get itemLevel(): HeadingLevel {
    return nextLevel(this.headingLevel, this.hasTitle)
  }

  get items(): FeatureItem[] {
    return this.section.items ?? []
  }

  get variant(): FeatureListVariant {
    const variant = this.section.variant
    return KNOWN_VARIANTS.includes(variant) ? variant : FALLBACK_VARIANT
  }

  get columns(): 2 | 3 {
    return this.section.columns ?? DEFAULT_COLUMNS
  }

  /**
   * `panel` and `checklist` are a single column at every tier, so the column
   * count is meaningless there and is not emitted — otherwise a stale
   * `columns: 2` in the bundle would look as though it were doing something.
   */
  get rootClasses(): string {
    const classes = ['feature-list', `feature-list--${this.variant}`]
    if (this.variant === 'cards' || this.variant === 'columns') {
      classes.push(`feature-list--cols-${this.columns}`)
    }
    return classes.join(' ')
  }

  itemTitleId(item: FeatureItem): string {
    return headingId(this.section.id, item.id)
  }

  /** An item with no title emits no heading at all — not an empty one. */
  hasItemTitle(item: FeatureItem): boolean {
    return (item.title ?? '').trim() !== ''
  }

  /**
   * Shared with `app-rich-text` rather than re-derived, so a link written in
   * markdown and a link written in the `link` field are classified by exactly
   * the same rule. In particular `mailto:` is internal in both: it opens a mail
   * client, not a tab, and the live page's host comparison opened a blank tab
   * for every support address.
   */
  isExternal(href: string): boolean {
    return isExternalHref(href)
  }
}
