import { Directive } from '@angular/core'

/**
 * Directive that applies accent hover background styling to icon buttons.
 * Sets the background color to --brand-secondary-dark on hover.
 *
 * @example
 * ```html
 * <button mat-icon-button accentButton>...</button>
 * ```
 */
@Directive({
  selector: '[accentButton]',
  standalone: true,
  host: {
    class: 'accent-button',
  },
})
export class AccentButtonDirective {}
