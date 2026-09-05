import { Component, Input } from '@angular/core'
import { BrandSecondaryDarkButtonDirective } from '@orcid/ui'

import {
  Action,
  InformativeImage,
  MediaSection,
  Tone,
  Video,
} from '../../../types/homepage-content.v2'
import { ContentImageComponent } from '../../components/content-image/content-image.component'
import { HeadingComponent } from '../../components/heading/heading.component'
import {
  isExternalHref,
  RichTextComponent,
} from '../../components/rich-text/rich-text.component'
import { VideoEmbedComponent } from '../../components/video-embed/video-embed.component'
import {
  headingId,
  HeadingLevel,
  SECTION_HEADING_LEVEL,
} from '../../heading-level'

/**
 * One action with every rendering decision already taken, so the template binds
 * values instead of calling predicates: `new URL()` then runs once per content
 * change rather than once per change-detection pass, and the "does this link
 * leave ORCID" rule stays in `isExternalHref`, shared with `app-rich-text`.
 */
interface RenderedAction {
  id: string
  label: string
  href: string
  external: boolean
  /** `style` is a role in the content; this is where the role becomes a look. */
  primary: boolean
  /** Filled with the design system's brand treatment. */
  brandFill: boolean
  /** Filled with the tone's own foreground instead (see `toRenderedAction`). */
  inverse: boolean
}

/**
 * `media` — prose beside a video or a picture (spec-v2 1.2).
 *
 * The three variants are host classes and nothing else. The DOM is the same in
 * all of them: kicker, heading, body, actions, then the media. That is not
 * tidiness, it is the accessibility contract — `media-start` was rejected from
 * the catalogue precisely because putting the media first at the wide tier
 * needs either `order:`/`row-reverse` (which desynchronises focus order from
 * reading order, and a video iframe is focusable) or a player announced ahead
 * of the heading that explains it. Neither appears in this component's
 * stylesheet, and a spec greps the compiled CSS to keep it that way.
 *
 * Nothing authored is ever dropped. `media-only` is described in the catalogue
 * as "media plus optional caption; title and body omitted" — that is guidance
 * to the editor, not a licence for the renderer to delete a title someone
 * published. A `media-only` section that carries only a `kicker` therefore
 * renders exactly that: one line of text above the media, which is a caption.
 */
@Component({
  selector: 'app-media-section',
  standalone: true,
  imports: [
    BrandSecondaryDarkButtonDirective,
    ContentImageComponent,
    HeadingComponent,
    RichTextComponent,
    VideoEmbedComponent,
  ],
  templateUrl: './media-section.component.html',
  styleUrls: ['./media-section.component.scss'],
})
export class MediaSectionComponent {
  private currentSection!: MediaSection

  actions: RenderedAction[] = []

  @Input({ required: true })
  set section(value: MediaSection) {
    this.currentSection = value
    this.actions = (value?.actions ?? []).map((action) =>
      toRenderedAction(action, value?.layout?.tone)
    )
  }

  get section(): MediaSection {
    return this.currentSection
  }

  /** Computed by the host from the section's position; never authored. */
  @Input() headingLevel: HeadingLevel = SECTION_HEADING_LEVEL

  /** Part of an external anchor's accessible name, never an icon alone. */
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`

  /** The `aria-labelledby` target the section shell points at. */
  get titleId(): string {
    return headingId(this.section.id)
  }

  get rootClasses(): string {
    return `media media--${this.section.variant}`
  }

  /**
   * Whether there is anything to put in the prose column at all.
   *
   * The column is conditional on its content rather than on the variant, so an
   * untitled `media-below` section and a `media-only` section produce the same
   * DOM. Making the variant switch the column off instead would mean a
   * `media-only` section with a kicker silently lost it.
   */
  get hasProse(): boolean {
    return !!(
      this.section.kicker ||
      this.section.title ||
      this.section.body ||
      this.actions.length
    )
  }

  /** Null unless this is a video section that actually carries a video. */
  get video(): Video | null {
    return this.section.mediaKind === 'video'
      ? this.section.video ?? null
      : null
  }

  /** Null unless this is an image section that actually carries an image. */
  get image(): InformativeImage | null {
    return this.section.mediaKind === 'image'
      ? this.section.image ?? null
      : null
  }

  /**
   * The `@if` for the media column tests this and sits on the COLUMN, never on
   * an inner div (spec-v2 1.2): an inner-div test leaves a padded half-row with
   * nothing in it, which at the wide tier reads as a broken layout.
   */
  get hasMedia(): boolean {
    return this.video !== null || this.image !== null
  }
}

/**
 * Maps an action's `style` role onto a treatment.
 *
 * `primary` normally takes `orcidBrandSecondaryDarkButton`, the design system's
 * filled button. It does not on the `brand-dark` tone: that fill
 * (`--orcid-color-brand-secondary-dark`) sits at roughly 1.7:1 against that
 * band's own background, so the control would have no perceivable boundary and
 * fail SC 1.4.11, which asks for 3:1. There the fill inverts to the tone's own
 * foreground — a pair `_tone.scss` has already proved against that background,
 * and contrast is symmetric, so the inverted pair is proved too.
 *
 * `secondary` is outlined in `currentColor`, which means it inherits the tone
 * foreground and so cannot be the wrong colour on any tone.
 */
function toRenderedAction(
  action: Action,
  tone: Tone | undefined
): RenderedAction {
  const primary = action.style !== 'secondary'
  const inverse = primary && tone === 'brand-dark'
  return {
    id: action.id,
    label: action.label,
    href: action.href,
    external: isExternalHref(action.href),
    primary,
    brandFill: primary && !inverse,
    inverse,
  }
}
