import { Component, Input, OnInit } from '@angular/core'
import { InboxNotificationHtml } from 'src/app/types/notifications.endpoint'

@Component({
  selector: 'app-notification-html',
  templateUrl: './notification-html.component.html',
  styleUrls: ['./notification-html.component.scss'],
  standalone: false,
})
export class NotificationHtmlComponent implements OnInit {
  _notification: InboxNotificationHtml
  messageBody: HTMLBodyElement
  @Input() set notification(notification: InboxNotificationHtml) {
    this._notification = notification
    const parser = new DOMParser()
    const htmlElement = parser.parseFromString(
      notification.bodyHtml,
      'text/html'
    )
    this.messageBody = htmlElement.getElementsByTagName('body')[0]
  }
  get notification() {
    return this._notification
  }

  constructor() {}

  ngOnInit(): void {}
}
