import { NgTemplateOutlet } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core'

import { Spacing, Tone } from '../../../types/homepage-content.v2'

/**
 * The chrome every homepage section is wrapped in: the landmark decision, the
 * tone pair, the spacing step, the anchor id and the container measure,
 * implemented once (spec-v2 4.2).
 *
 * The landmark rule is the reason this component exists. A `<section>` is only
 * a region for assistive technology when it has an accessible name, and an
 * unnamed `<section>` is worse than a `<div>`: some screen readers announce it
 * as an empty region the user has to step through. So a section that has a
 * heading emits `<section aria-labelledby>` pointing at that heading, and a
 * section that has none emits a plain `<div>`. There is no third branch — no
 * invented `aria-label`, because a name nobody wrote is a name nobody
 * translated.
 */
@Component({
  selector: 'app-section-shell',
  templateUrl: './section-shell.component.html',
  styleUrls: ['./section-shell.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class SectionShellComponent implements AfterViewInit, OnDestroy {
  /** The section's content id. Becomes `section-<id>`, the in-page anchor. */
  @Input({ required: true }) sectionId = ''

  @Input() tone: Tone = 'default'

  @Input() spacing: Spacing = 'normal'

  /**
   * The DOM id of the heading that names this section. Absent when the section
   * has no heading, which is what switches the landmark off.
   */
  @Input() labelledBy?: string

  /** Optional styling hooks, `section--<type>` / `section--<variant>`. */
  @Input() sectionType?: string
  @Input() sectionVariant?: string

  get anchorId(): string {
    return `section-${this.sectionId}`
  }

  /**
   * Set once the heading named by `labelledBy` is known to be absent.
   *
   * A section can ask to be named by a heading its own content then declines to
   * render — the news feed does exactly this when the feed is empty, because an
   * empty named region is worse than nothing. Pointing `aria-labelledby` at an
   * id that is not in the document leaves a `<section>` with no accessible
   * name, which is both a landmark that says nothing and an invalid use of the
   * attribute. So the claim is checked rather than trusted.
   */
  private nameIsMissing = false
  private watcher?: MutationObserver

  constructor(
    private host: ElementRef<HTMLElement>,
    private changes: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    if (!this.labelledBy) return

    this.checkName()

    // Checking once is not enough. A section's content can appear and then be
    // withdrawn: the news feed renders a heading while it loads and removes
    // everything if the feed turns out to be empty, because an empty named
    // region is worse than no region. So the claim is re-checked whenever the
    // content changes, outside Angular so an idle page costs nothing.
    this.zone.runOutsideAngular(() => {
      this.watcher = new MutationObserver(() => this.checkName())
      this.watcher.observe(this.host.nativeElement, {
        childList: true,
        subtree: true,
      })
    })
  }

  ngOnDestroy(): void {
    this.watcher?.disconnect()
  }

  private checkName(): void {
    if (!this.labelledBy) return

    const missing = !this.host.nativeElement.querySelector(
      `#${CSS.escape(this.labelledBy)}`
    )
    if (missing === this.nameIsMissing) return

    this.nameIsMissing = missing
    this.zone.run(() => this.changes.detectChanges())
  }

  get isLandmark(): boolean {
    return !!this.labelledBy && !this.nameIsMissing
  }

  /** Only emitted when the heading it points at is really there. */
  get labelledByOrNull(): string | null {
    return this.isLandmark ? (this.labelledBy as string) : null
  }

  get chromeClasses(): string {
    const classes = ['section']
    if (this.sectionType) {
      classes.push(`section--${this.sectionType}`)
    }
    if (this.sectionVariant) {
      classes.push(`section--${this.sectionVariant}`)
    }
    classes.push(`tone--${this.tone}`, `spacing--${this.spacing}`)
    return classes.join(' ')
  }
}
