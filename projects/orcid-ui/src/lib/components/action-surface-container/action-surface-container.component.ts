import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

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
  imports: [],
  templateUrl: './action-surface-container.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./action-surface-container.component.scss'],
})
export class ActionSurfaceContainerComponent {
  @Input() title = ''
  @Input() subtitle = ''
}
