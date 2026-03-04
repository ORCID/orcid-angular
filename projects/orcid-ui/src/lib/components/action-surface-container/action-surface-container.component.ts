import { Component, Input } from '@angular/core'
import { NgIf } from '@angular/common'

/**
 * Container surface for action surfaces or other content blocks.
 *
 * Usage:
 * All user-facing strings (title, subtitle, content) must be provided by the parent.
 *
 * <orcid-action-surface-container title="Title" subtitle="Subtitle">
 *   <orcid-action-surface>...</orcid-action-surface>
 * </orcid-action-surface-container>
 */
@Component({
  selector: 'orcid-action-surface-container',
  standalone: true,
  imports: [NgIf],
  templateUrl: './action-surface-container.component.html',
  styleUrls: ['./action-surface-container.component.scss'],
})
export class ActionSurfaceContainerComponent {
  @Input() title = ''
  @Input() subtitle = ''
}
