import { Component, Input } from '@angular/core'

import { LinkItem, QuickLinksSection } from '../../../types/homepage-content.v2'
import { ContentImageComponent } from '../../components/content-image/content-image.component'
import { HeadingComponent } from '../../components/heading/heading.component'
import { isExternalHref } from '../../components/rich-text/rich-text.component'
import { HeadingLevel, headingId } from '../../heading-level'

/**
 * The icon quick-links navigation (spec-v2 1.4).
 *
 * This is the page's primary conversion path — "Get my ORCID iD and record" —
 * and it has no representation at all in the v1 model, so everything here is
 * new rather than ported.
 *
 * The three variants change the shape of the row and nothing else: the DOM
 * order, the single heading and the link set are identical in all three, so
 * choosing `grid` over `bar` cannot change a word of what a screen reader
 * announces. The only content-visible difference is `description`, which only
 * `list` has room for; it is supplementary by schema (optional, ≤120 chars)
 * and never carries the link's meaning, which lives in `label`.
 */
@Component({
  selector: 'app-quick-links-section',
  standalone: true,
  imports: [HeadingComponent, ContentImageComponent],
  templateUrl: './quick-links-section.component.html',
  styleUrls: ['./quick-links-section.component.scss'],
})
export class QuickLinksSectionComponent {
  @Input({ required: true }) section!: QuickLinksSection

  /** Computed by the host from the section's position; never authored. */
  @Input({ required: true }) headingLevel!: HeadingLevel

  /**
   * The rendered box for an icon, in CSS pixels, mirrored into the `<img>`'s
   * `width`/`height` attributes so the row reserves its space before the bytes
   * arrive. The content contract carries no dimensions for a `DecorativeImage`
   * (§9 has the build inject them for content images), and an icon's box is a
   * design constant rather than a property of the file, so it is stated here
   * and kept identical to `--quick-links-icon-size` in the stylesheet.
   */
  readonly iconSize = 40

  /** Part of the anchor's accessible name, so the cue is never visual only. */
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`

  /** The heading's DOM id, which is what names the `<nav>` landmark. */
  get titleId(): string {
    return headingId(this.section.id)
  }

  get rootClass(): string {
    return `quick-links quick-links--${this.section.variant}`
  }

  /**
   * `grid` and `list` force the heading visible (spec-v2 1.4).
   *
   * `bar` is a single tinted strip whose grouping is obvious by shape, so an
   * editor may hide its heading and keep only the landmark name. A grid of
   * cards or a vertical list has no such shape — without a visible heading a
   * sighted user gets no grouping cue at all, while a screen-reader user gets
   * one, which is exactly the asymmetry SC 1.3.1 exists to prevent. The
   * catalogue default is `true`, so the fallback matters.
   */
  get titleHidden(): boolean {
    return this.section.variant === 'bar' && (this.section.titleHidden ?? true)
  }

  /** Only `list` has the room; the other variants would truncate it. */
  get showDescriptions(): boolean {
    return this.section.variant === 'list'
  }

  /**
   * Reuses the classifier `app-rich-text` already exports rather than
   * re-deriving it, so a `mailto:` stays internal here for the same verified
   * reason it does there (`new URL('mailto:x').host === ''`).
   */
  isExternal(link: LinkItem): boolean {
    return isExternalHref(link.href)
  }
}
