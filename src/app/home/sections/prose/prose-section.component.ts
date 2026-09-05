import { Component, Input } from '@angular/core'

import { ProseSection } from '../../../types/homepage-content.v2'
import { HeadingComponent } from '../../components/heading/heading.component'
import { RichTextComponent } from '../../components/rich-text/rich-text.component'
import { HeadingLevel, headingId } from '../../heading-level'

/**
 * A heading and a body — the escape hatch (spec-v2 1.5).
 *
 * It exists so that an editor who needs a paragraph of text does not reach for
 * `feature-list` with a single item, or ask for markdown-lite to grow lists
 * and blockquotes (D5). Everything structural still lives in a typed section.
 *
 * The three variants are measure and type scale only. The DOM is identical in
 * all three — one optional heading, then the parsed body — so `centered` is a
 * visual choice that cannot change what is read out or in what order.
 */
@Component({
  selector: 'app-prose-section',
  standalone: true,
  imports: [HeadingComponent, RichTextComponent],
  templateUrl: './prose-section.component.html',
  styleUrls: ['./prose-section.component.scss'],
})
export class ProseSectionComponent {
  @Input({ required: true }) section!: ProseSection

  /** Computed by the host from the section's position; never authored. */
  @Input({ required: true }) headingLevel!: HeadingLevel

  /**
   * The heading's DOM id, so `app-section-shell` can point `aria-labelledby`
   * at it. Absent from the DOM when there is no title, which is what tells the
   * shell to emit a plain `<div>` rather than an unnamed region.
   */
  get titleId(): string {
    return headingId(this.section.id)
  }

  /** Whitespace is as absent as nothing at all for a heading. */
  get hasTitle(): boolean {
    return (this.section.title ?? '').trim() !== ''
  }

  get rootClass(): string {
    return `prose prose--${this.section.variant}`
  }
}
