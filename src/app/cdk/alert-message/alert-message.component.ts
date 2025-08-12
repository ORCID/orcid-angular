import { Component, Input } from '@angular/core'
import { AlertType } from 'src/app/constants'

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: [
    './alert-message.component.scss',
    'alert-message.component.scss-theme.scss',
  ],
  standalone: false,
})
/**
 * Use `title` and `content` attributes to display the message
 * Use headings (h1, h2...) for the title
 * Title is stripped of any margin, has 24px line height and is bold
 * Content has `margin-top: 8px` on its first child if it has any, line height is 21px
 */
export class AlertMessageComponent {
  @Input() type: AlertType = 'notice'
}
