import { Directionality } from '@angular/cdk/bidi'
import { BreakpointObserver } from '@angular/cdk/layout'
import { DOCUMENT, NgTemplateOutlet } from '@angular/common'
import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  inject,
} from '@angular/core'
import { Subscription } from 'rxjs'

import {
  Audience,
  AudienceSelectorSection,
  DecorativeImage,
  FeatureItem,
} from '../../../types/homepage-content.v2'
import { ContentImageComponent } from '../../components/content-image/content-image.component'
import { HeadingComponent } from '../../components/heading/heading.component'
import {
  isExternalHref,
  RichTextComponent,
} from '../../components/rich-text/rich-text.component'
import {
  headingId,
  HeadingLevel,
  nextLevel,
  SECTION_HEADING_LEVEL,
} from '../../heading-level'
import { AUDIENCE_TABS_QUERY } from './audience-selector.constants'

/** Which of the three structural branches is on screen. */
export type AudienceSelectorMode = 'tabs' | 'accordion' | 'stacked'

/** One feature card with every rendering decision already taken. */
interface RenderedFeature {
  id: string
  title?: string
  body: string
  icon?: DecorativeImage
  linkLabel?: string
  linkHref?: string
  linkExternal: boolean
}

/**
 * One audience, plus the four DOM ids the three branches wire ARIA with.
 *
 * They are computed once per content change rather than in a getter, because
 * every one of them is read several times per change-detection pass and an id
 * that is recomputed is an id that can come out different.
 */
interface RenderedAudience {
  id: string
  label: string
  intro: string
  background?: DecorativeImage
  /** The heading element's own id. */
  headingId: string
  /** The accordion's `<button>`; the accordion panel is labelled by it. */
  triggerId: string
  /** The tab strip's `<button role="tab">`; the tabpanel is labelled by it. */
  tabId: string
  panelId: string
  features: RenderedFeature[]
}

function toRenderedFeature(feature: FeatureItem): RenderedFeature {
  const href = feature.link?.href
  return {
    id: feature.id,
    title: feature.title,
    body: feature.body,
    icon: feature.icon,
    linkLabel: feature.link?.label,
    linkHref: href,
    // Resolved once here, so `new URL()` never runs inside change detection and
    // the external-link rule lives in exactly one place (shared with
    // `app-rich-text`, which is why `mailto:` counts as internal).
    linkExternal: href ? isExternalHref(href) : false,
  }
}

function toRenderedAudience(
  audience: Audience,
  sectionId: string
): RenderedAudience {
  const base = headingId(sectionId, audience.id)
  return {
    id: audience.id,
    label: audience.label,
    intro: audience.intro,
    background: audience.background,
    headingId: base,
    // Suffixed rather than rebuilt, so the escaping that makes `headingId`
    // collision-proof covers these three ids too.
    triggerId: `${base}-trigger`,
    tabId: `${base}-tab`,
    panelId: `${base}-panel`,
    features: (audience.features ?? []).map(toRenderedFeature),
  }
}

/**
 * `audience-selector` — the "ORCID is for…" chooser (spec-v2 1.1, 5.5).
 *
 * The page's primary navigation device, and the component today's build gets
 * most wrong: at 375px it renders a horizontally scrolling Material tab strip
 * whose tabs 3–6 are reachable by pointer only through two ~32px unlabelled
 * chevrons.
 *
 * Three branches, one of which is on screen at a time — never two with one
 * hidden by CSS, which would duplicate every id, every `aria-controls` and
 * every word a screen reader reads:
 *
 *   - below 1024px, an APG single-select accordion. Each header is a real
 *     `<button>` inside a real heading, so the six audiences appear in a screen
 *     reader's heading list and a user can jump straight to "Funders &
 *     Facilities". That is the argument that decides the mobile design: with
 *     `role="tab"` the labels are not headings, and on a screen that never
 *     shows the whole page at once heading navigation is how people move.
 *   - at 1024px and up, an APG tab strip.
 *   - `stacked`, at every width: no widget at all, every audience always open.
 *
 * The heading outline is identical in all three. A variant chooses a layout,
 * never a meaning.
 */
@Component({
  selector: 'app-audience-selector-section',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    HeadingComponent,
    RichTextComponent,
    ContentImageComponent,
  ],
  templateUrl: './audience-selector-section.component.html',
  styleUrls: ['./audience-selector-section.component.scss'],
})
export class AudienceSelectorSectionComponent
  implements AfterViewChecked, OnDestroy
{
  private readonly breakpoints = inject(BreakpointObserver)
  private readonly directionality = inject(Directionality)
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef)
  private readonly document = inject(DOCUMENT)
  private readonly widthSubscription: Subscription

  private currentSection!: AudienceSelectorSection
  private focusAfterRender: string | null = null

  audiences: RenderedAudience[] = []

  /** Survives the accordion↔tabs switch: it is state of the section, not of a widget. */
  selectedAudienceId = ''

  /** True at or above `AUDIENCE_TABS_MIN_WIDTH`. */
  isWide = false

  /** The tablist's accessible name. Static UI text, so it is localised here. */
  readonly tablistLabel = $localize`:@@home.audienceTablist:Choose who you are`

  /** Part of an external link's accessible name — never an icon on its own. */
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`

  constructor() {
    // Subscribed here rather than in ngOnInit because BreakpointObserver emits
    // the current match state synchronously on subscribe: the first
    // change-detection pass therefore already renders the right branch. An
    // accordion that flips to tabs after the first paint would be both a
    // visible jump and a wrong-mode LCP. `audience-selector.first-paint.spec.ts`
    // holds this.
    this.widthSubscription = this.breakpoints
      .observe(AUDIENCE_TABS_QUERY)
      .subscribe((state) => this.onWidthChange(state.matches))
  }

  @Input({ required: true })
  set section(value: AudienceSelectorSection) {
    this.currentSection = value
    this.audiences = (value?.audiences ?? []).map((audience) =>
      toRenderedAudience(audience, value.id)
    )
    // Exactly one audience is open at all times, and the open one has to exist:
    // a bundle can reorder or rename audiences between renders.
    if (
      !this.audiences.some(
        (audience) => audience.id === this.selectedAudienceId
      )
    ) {
      this.selectedAudienceId = this.audiences[0]?.id ?? ''
    }
  }

  get section(): AudienceSelectorSection {
    return this.currentSection
  }

  /** Computed by the host from the section's position; never authored. */
  @Input() headingLevel: HeadingLevel = SECTION_HEADING_LEVEL

  ngAfterViewChecked(): void {
    // Focus is restored here rather than in the resize handler because the
    // control it moves to does not exist until the new branch has rendered.
    const pending = this.focusAfterRender
    if (pending === null) {
      return
    }
    const target = this.controlFor(pending)
    if (!target) {
      return
    }
    this.focusAfterRender = null
    target.focus()
  }

  ngOnDestroy(): void {
    this.widthSubscription.unsubscribe()
  }

  // -------------------------------------------------------------------------
  // Structure
  // -------------------------------------------------------------------------

  get mode(): AudienceSelectorMode {
    if (this.section?.variant === 'stacked') {
      return 'stacked'
    }
    return this.isWide ? 'tabs' : 'accordion'
  }

  get hasTitle(): boolean {
    return !!this.section?.title
  }

  /** What the shell's `aria-labelledby` points at when there is a title. */
  get titleId(): string {
    return headingId(this.section.id)
  }

  /**
   * An untitled section promotes its audiences instead of orphaning them, so a
   * section with no heading of its own cannot open a gap in the outline.
   */
  get audienceLevel(): HeadingLevel {
    return nextLevel(this.headingLevel, this.hasTitle)
  }

  /** An audience always renders its label, so a feature is always one deeper. */
  get featureLevel(): HeadingLevel {
    return nextLevel(this.audienceLevel, true)
  }

  /**
   * The photograph is `tabs-photo`'s, and only at tab widths. Below 1024 the
   * flat tone shows through instead — the image is not rendered at all rather
   * than rendered and hidden, so a phone never pays for bytes it cannot see.
   */
  get showsPhoto(): boolean {
    return this.section?.variant === 'tabs-photo' && this.mode === 'tabs'
  }

  // -------------------------------------------------------------------------
  // Selection
  // -------------------------------------------------------------------------

  isSelected(audienceId: string): boolean {
    return this.selectedAudienceId === audienceId
  }

  /**
   * Opens an audience. Clicking the one already open is deliberately a no-op:
   * exactly one is open at all times, so there is nothing to collapse. The
   * header stays a plain enabled button — never `aria-disabled`, never removed
   * from the tab order — because a control a user can reach and cannot use is
   * less confusing than one that vanishes under their cursor.
   */
  select(audienceId: string): void {
    this.selectedAudienceId = audienceId
  }

  // -------------------------------------------------------------------------
  // Keyboard
  // -------------------------------------------------------------------------

  /**
   * Arrow/Home/End inside the tab strip: move focus and activate, which is the
   * automatic-activation half of the APG tabs pattern.
   */
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const next = this.horizontalTarget(event.key, index)
    if (next === null) {
      return
    }
    event.preventDefault()
    this.select(this.audiences[next].id)
    this.focusAfterRender = this.audiences[next].id
  }

  /**
   * Up/Down/Home/End between accordion headers: focus only, never activation.
   * They are a convenience — every header is an ordinary tab stop, so there is
   * no roving tabindex and no audience reachable by arrow keys alone.
   */
  onAccordionKeydown(event: KeyboardEvent, index: number): void {
    const next = this.verticalTarget(event.key, index)
    if (next === null) {
      return
    }
    event.preventDefault()
    this.focusAfterRender = this.audiences[next].id
  }

  private horizontalTarget(key: string, index: number): number | null {
    const count = this.audiences.length
    if (count === 0) {
      return null
    }
    // Material's own tab header does this through Directionality too: in a
    // right-to-left page ArrowLeft moves towards the *next* tab, because "next"
    // is a direction on the screen, not a direction in the array.
    const rtl = this.directionality.value === 'rtl'
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft'

    if (key === forward) {
      return (index + 1) % count
    }
    if (key === backward) {
      return (index - 1 + count) % count
    }
    return this.edgeTarget(key, count)
  }

  private verticalTarget(key: string, index: number): number | null {
    const count = this.audiences.length
    if (count === 0) {
      return null
    }
    if (key === 'ArrowDown') {
      return (index + 1) % count
    }
    if (key === 'ArrowUp') {
      return (index - 1 + count) % count
    }
    return this.edgeTarget(key, count)
  }

  private edgeTarget(key: string, count: number): number | null {
    if (key === 'Home') {
      return 0
    }
    if (key === 'End') {
      return count - 1
    }
    return null
  }

  // -------------------------------------------------------------------------
  // The responsive switch
  // -------------------------------------------------------------------------

  private onWidthChange(matches: boolean): void {
    if (matches === this.isWide) {
      return
    }
    // SC 1.3.4: reflow must not cost a keyboard user their place. If focus was
    // inside the widget, it moves to the equivalent control for the same
    // audience in the branch that replaces it — never to <body>.
    const keepsFocus = this.widgetHasFocus()
    this.isWide = matches
    if (keepsFocus) {
      this.focusAfterRender = this.selectedAudienceId
    }
  }

  private widgetHasFocus(): boolean {
    const active = this.document.activeElement
    return !!active && this.host.nativeElement.contains(active)
  }

  /** The tab, or the accordion header, that stands for one audience. */
  private controlFor(audienceId: string): HTMLElement | null {
    const audience = this.audiences.find((item) => item.id === audienceId)
    if (!audience) {
      return null
    }
    const id = this.mode === 'tabs' ? audience.tabId : audience.triggerId
    return this.host.nativeElement.querySelector<HTMLElement>(`[id="${id}"]`)
  }
}
