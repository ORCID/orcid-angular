import { Component, Input } from '@angular/core'
import { NgIf, NgClass } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'

/**
 * Alert message component for contextual notices, info, warnings and success messages.
 *
 * Usage:
 * <app-alert-message type="notice">
 *   <span title>Headline</span>
 *   <span content>Supporting details go here.</span>
 * </app-alert-message>
 *
 * Slots:
 *   [title]   - Bold title line (any inline/heading elements allowed; heading margins stripped)
 *   [content] - Body content below title (first element gets margin-top:8px if title exists)
 */
@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [NgIf, NgClass, MatIconModule],
  templateUrl: './alert-message.component.html',
  styleUrls: [
    './alert-message.component.scss',
    './alert-message.component.scss-theme.scss',
  ],
})
export class AlertMessageComponent {
  /** Visual style variant */
  @Input() type: AlertType = 'notice'
}

export type AlertType = 'notice' | 'info' | 'warning' | 'success'
