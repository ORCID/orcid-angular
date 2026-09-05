import { Component, Input } from '@angular/core'

let nextDisclosureId = 0

/**
 * A show/hide control over projected content: the WAI-ARIA disclosure pattern.
 *
 * A real `<button type="button">` rather than a `<div (click)>` or a
 * `<summary>`: the button gives keyboard operation, the correct role and a
 * focus ring for free, and unlike `<details>` its open state is ours to control
 * and to test. There is no ARIA role on the revealed region — the pattern does
 * not define one, and inventing `region` would add a landmark to the page
 * outline for every transcript.
 */
@Component({
  selector: 'app-disclosure',
  standalone: true,
  templateUrl: './disclosure.component.html',
  styleUrls: ['./disclosure.component.scss'],
})
export class DisclosureComponent {
  /** The button's text. Supplied by the caller, already localised. */
  @Input({ required: true }) label!: string

  /** Whether the content starts revealed. */
  @Input() open = false

  /**
   * `aria-controls` has to name an element that exists, so the region is always
   * in the DOM and the id is unique per instance — a page may hold several
   * videos, each with a transcript.
   */
  readonly regionId = `disclosure-region-${nextDisclosureId++}`

  toggle(): void {
    this.open = !this.open
  }
}
