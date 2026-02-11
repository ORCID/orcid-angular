import { Component, Input } from '@angular/core'
import { NgIf } from '@angular/common'

/**
 * Action surface for a compact message with projected actions.
 * All user-facing strings (text, button labels) must be provided by the parent;
 * this component does not contain any translatable strings.
 *
 * Usage:
 * <orcid-action-surface icon="work_outline">
 *   <span text><strong>Org name</strong> message text...</span>
 *   <div actions>
 *     <button mat-button>Action 1</button>
 *     <button mat-flat-button>Action 2</button>
 *   </div>
 * </orcid-action-surface>
 *
 * Slots:
 *   [text]    - Projected message text (inline/heading elements allowed).
 *   [actions] - Projected material buttons (mat-button, mat-flat-button, etc).
 */
@Component({
  selector: 'orcid-action-surface',
  standalone: true,
  imports: [NgIf],
  templateUrl: './action-surface.component.html',
  styleUrls: ['./action-surface.component.scss'],
})
export class ActionSurfaceComponent {
  /** Optional material icon name, e.g. "work_outline". */
  @Input() icon?: string

  /** Optional CSS color for the icon (CSS var or hex). */
  @Input() iconColor?: string
}
