import { Component, Input } from '@angular/core'
import { AlertType } from 'src/app/constants'

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: [
    './alert-message.component.scss',
    'alert-message.component.scss-theme.scss',
  ],
})
/**
 * Use `title` and `content` attributes to display the message
 * Use headings (h1, h2...) for the title
 * Margin is set to `0 0 8px 0` for all headings
 * Line height and letter spacing is also standardized
 */
export class AlertMessageComponent {
  @Input() type: AlertType = 'notice'
}
