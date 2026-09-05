import { Directionality } from '@angular/cdk/bidi'
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  inject,
} from '@angular/core'

import {
  DecorativeImage,
  FocalPoint,
  InformativeImage,
} from 'src/app/types/homepage-content.v2'

/**
 * `object-position` for each focal point, per writing direction.
 *
 * `start`/`end` exist instead of `left`/`right` precisely so a photograph that
 * is cropped towards the reader's starting edge stays cropped that way in
 * Arabic (spec §9, "focalPoint uses start/end, not left/right"). Percentages
 * rather than keywords so the value a test reads back is the value written.
 */
const FOCAL_POSITION: Record<FocalPoint, { ltr: string; rtl: string }> = {
  center: { ltr: '50% 50%', rtl: '50% 50%' },
  top: { ltr: '50% 0%', rtl: '50% 0%' },
  bottom: { ltr: '50% 100%', rtl: '50% 100%' },
  start: { ltr: '0% 50%', rtl: '100% 50%' },
  end: { ltr: '100% 50%', rtl: '0% 50%' },
}

/**
 * The one place a content image becomes an `<img>`.
 *
 * Two rules are enforced here rather than left to each section:
 *
 * 1. Whether an image is decorative is a property of the *slot*, not of the
 *    content (spec §3.2). The caller states it; a `decorative` image is always
 *    `alt="" aria-hidden="true"` even if the bundle carries an `alt`, and an
 *    informative one always carries the authored `alt`.
 * 2. It is an `<img>`, never a CSS `background-image`. Background images are
 *    dropped in Windows forced-colors mode, which is how the live homepage
 *    loses its quick-link icons entirely.
 */
@Component({
  selector: 'app-content-image',
  standalone: true,
  templateUrl: './content-image.component.html',
  styleUrls: ['./content-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentImageComponent implements OnChanges {
  private readonly directionality = inject(Directionality)

  @Input({ required: true }) image!: DecorativeImage | InformativeImage

  /**
   * True when this slot carries no meaning. The section decides; nothing in the
   * content bundle can set it.
   */
  @Input() decorative = false

  /**
   * The same switch written the other way round, because §8's section templates
   * are written as `[informative]="true"`. Both spellings set one flag, so a
   * section can use whichever reads better at the call site.
   */
  @Input() set informative(value: boolean) {
    this.decorative = !value
  }

  /** Named in the console warning so an editor can find the offending item. */
  @Input() itemId?: string

  /** Intrinsic pixel dimensions, injected by the content build, to reserve
   * space before the bytes arrive. The content contract carries no dimensions,
   * so the section supplies them. */
  @Input() width?: number
  @Input() height?: number

  @Input() srcset?: string
  @Input() sizes?: string

  /**
   * Set on the first section's image only: it is the LCP candidate, so it loads
   * eagerly at high priority while everything below the fold stays lazy.
   */
  @Input() priority = false

  private warnedFor?: string

  /**
   * Surfaced on the host so the CMS preview can outline the offending slot and
   * NG CI can assert `[data-a11y-error]` is empty on every fixture.
   */
  @HostBinding('attr.data-a11y-error')
  get a11yError(): string | null {
    return this.hasAltError ? 'missing-alt' : null
  }

  /** The authored alt, trimmed. Whitespace is as unusable as nothing at all. */
  get authoredAlt(): string {
    const alt = (this.image as InformativeImage | undefined)?.alt
    return typeof alt === 'string' ? alt.trim() : ''
  }

  get hasAltError(): boolean {
    return !this.decorative && this.authoredAlt === ''
  }

  /** A decorative image is hidden from readers; an informative one is named. */
  get alt(): string {
    return this.decorative ? '' : this.authoredAlt
  }

  get ariaHidden(): string | null {
    return this.decorative ? 'true' : null
  }

  get src(): string {
    return this.image?.src ?? ''
  }

  get objectPosition(): string {
    const focal = this.image?.focalPoint
    const entry = (focal && FOCAL_POSITION[focal]) || FOCAL_POSITION.center
    return this.directionality.value === 'rtl' ? entry.rtl : entry.ltr
  }

  get renders(): boolean {
    return this.src !== '' && !this.hasAltError
  }

  ngOnChanges(): void {
    if (!this.hasAltError) {
      return
    }
    // Once per offending image: a repeated warning in a change-detection loop
    // buries the one line the editor needs.
    const key = this.itemId ?? this.src
    if (this.warnedFor === key) {
      return
    }
    this.warnedFor = key
    console.warn(
      `[content-image] informative image has no alt text: ${key || '(no src)'}`
    )
  }
}
