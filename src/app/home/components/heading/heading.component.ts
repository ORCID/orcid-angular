import { NgTemplateOutlet } from '@angular/common'
import { Component, Input } from '@angular/core'

import { clampLevel, HeadingLevel } from '../../heading-level'

/**
 * The only place in `src/app/home/**` that may emit an `h1`–`h6`.
 *
 * Every homepage heading goes through here so that the semantic level is a
 * computed value (see `heading-level.ts`) while the visual size is a separate,
 * freely chosen class. Keeping those two independent is the whole point: a
 * designer can make a level-3 heading look large without breaking the outline
 * a screen reader navigates by.
 *
 * A CI grep (`scripts/check-home-styles.sh`) fails the build if a raw heading
 * tag appears anywhere else under `src/app/home/**`.
 */
@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [NgTemplateOutlet],
  styleUrls: ['./heading.component.scss'],
  template: `
    <!--
      The projected text is captured once and stamped into whichever branch
      wins. Angular fills only the FIRST <ng-content> of a given selector, so
      six literal <ng-content/> elements — one per @case — would leave every
      heading but the h1 empty.
    -->
    <ng-template #text><ng-content /></ng-template>

    @switch (clamped) { @case (1) {
    <h1
      [attr.id]="id ?? null"
      [class]="visualClass"
      [class.cdk-visually-hidden]="hidden"
      [attr.lang]="lang ?? null"
      [attr.dir]="dir ?? null"
    >
      <ng-container [ngTemplateOutlet]="text" />
    </h1>
    } @case (2) {
    <h2
      [attr.id]="id ?? null"
      [class]="visualClass"
      [class.cdk-visually-hidden]="hidden"
      [attr.lang]="lang ?? null"
      [attr.dir]="dir ?? null"
    >
      <ng-container [ngTemplateOutlet]="text" />
    </h2>
    } @case (3) {
    <h3
      [attr.id]="id ?? null"
      [class]="visualClass"
      [class.cdk-visually-hidden]="hidden"
      [attr.lang]="lang ?? null"
      [attr.dir]="dir ?? null"
    >
      <ng-container [ngTemplateOutlet]="text" />
    </h3>
    } @case (4) {
    <h4
      [attr.id]="id ?? null"
      [class]="visualClass"
      [class.cdk-visually-hidden]="hidden"
      [attr.lang]="lang ?? null"
      [attr.dir]="dir ?? null"
    >
      <ng-container [ngTemplateOutlet]="text" />
    </h4>
    } @case (5) {
    <h5
      [attr.id]="id ?? null"
      [class]="visualClass"
      [class.cdk-visually-hidden]="hidden"
      [attr.lang]="lang ?? null"
      [attr.dir]="dir ?? null"
    >
      <ng-container [ngTemplateOutlet]="text" />
    </h5>
    } @default {
    <h6
      [attr.id]="id ?? null"
      [class]="visualClass"
      [class.cdk-visually-hidden]="hidden"
      [attr.lang]="lang ?? null"
      [attr.dir]="dir ?? null"
    >
      <ng-container [ngTemplateOutlet]="text" />
    </h6>
    } }
  `,
})
export class HeadingComponent {
  @Input({ required: true }) level!: HeadingLevel

  /** Derived from content ids by `headingId()`, so `aria-labelledby` can point here. */
  @Input() id?: string

  /** Visual size is independent of semantic level. */
  @Input() visualClass = 'orc-font-heading'

  /**
   * Hides the heading from sight while leaving it in the accessibility tree.
   *
   * This is deliberately *not* the native `hidden` attribute, which would do
   * the opposite and remove the heading from the tree entirely. Because
   * `hidden` is declared as an input here, Angular binds the input and never
   * touches the DOM property of the same name.
   */
  @Input() hidden = false

  /** Set when this string fell back to English inside a non-English page. */
  @Input() lang?: string

  /** Paired with `lang` when the fallback language runs the other way. */
  @Input() dir?: string

  get clamped(): HeadingLevel {
    return clampLevel(this.level)
  }
}
