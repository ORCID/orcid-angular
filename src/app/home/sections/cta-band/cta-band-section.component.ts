import { Component, Input } from '@angular/core'
import { BrandSecondaryDarkButtonDirective } from '@orcid/ui'

import {
  Action,
  CtaBandSection,
  Tone,
} from '../../../types/homepage-content.v2'
import { HeadingComponent } from '../../components/heading/heading.component'
import {
  isExternalHref,
  RichTextComponent,
} from '../../components/rich-text/rich-text.component'
import {
  headingId,
  HeadingLevel,
  SECTION_HEADING_LEVEL,
} from '../../heading-level'

/**
 * One action with every rendering decision already taken.
 *
 * `new URL()` runs once per content change rather than once per change
 * detection pass, and the template binds booleans instead of calling
 * predicates - which also keeps the "is this link external" rule in exactly
 * one place (`isExternalHref`, shared with `app-rich-text`).
 */
interface RenderedAction {
  id: string
  label: string
  href: string
  external: boolean
  /** `style` is a role, so this is the only place the role becomes a look. */
  primary: boolean
  /** Filled with the design-system brand treatment. */
  brandFill: boolean
  /** Filled with the tone's own foreground instead (see `toRenderedAction`). */
  inverse: boolean
}

/**
 * `cta-band` - a heading, an optional sentence and up to two actions
 * (spec-v2 1.6).
 *
 * The actions are anchors, never buttons: they navigate, so middle-click,
 * Ctrl-click and "open in new tab" have to work. The v1 static fallback used
 * `routerLink="" (click)`, which breaks all three.
 *
 * The three variants change chrome only. The element order and the heading
 * outline are identical in all of them, so switching variant cannot change
 * what a screen reader hears.
 */
@Component({
  selector: 'app-cta-band-section',
  standalone: true,
  imports: [
    HeadingComponent,
    RichTextComponent,
    BrandSecondaryDarkButtonDirective,
  ],
  templateUrl: './cta-band-section.component.html',
  styleUrls: ['./cta-band-section.component.scss'],
})
export class CtaBandSectionComponent {
  private currentSection!: CtaBandSection

  actions: RenderedAction[] = []

  @Input({ required: true })
  set section(value: CtaBandSection) {
    this.currentSection = value
    this.actions = (value.actions ?? []).map((action) =>
      toRenderedAction(action, value.layout?.tone)
    )
  }

  get section(): CtaBandSection {
    return this.currentSection
  }

  /** Computed by the host from the section's position; never authored. */
  @Input() headingLevel: HeadingLevel = SECTION_HEADING_LEVEL

  /** Part of each external anchor's accessible name, never an icon alone. */
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`

  get titleId(): string {
    return headingId(this.section.id)
  }

  get bandClasses(): string {
    return `cta-band cta-band--${this.section.variant}`
  }
}

/**
 * Maps the `style` role onto a treatment.
 *
 * `primary` normally takes `orcidBrandSecondaryDarkButton`, the design
 * system's filled button. On the `brand-dark` tone it does not: that fill sits
 * at roughly 1.7:1 against the band's own background, so the control would
 * have no perceivable boundary and would fail SC 1.4.11, which asks for 3:1.
 * There the fill is inverted to the tone's own foreground - a pair
 * `_tone.scss` has already proved against that background - so the button
 * stays a button.
 *
 * `secondary` is outlined in `currentColor` for the same reason: it inherits
 * the tone foreground and so cannot be the wrong colour on any tone.
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
