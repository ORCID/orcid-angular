import { Component, OnInit, Input, Inject } from '@angular/core'
import { InboxNotificationInstitutional } from 'src/app/types/notifications.endpoint'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-notification-permission-institutional-connection',
  templateUrl:
    './notification-permission-institutional-connection.component.html',
  styleUrls: [
    './notification-permission-institutional-connection.component.scss',
  ],
  preserveWhitespaces: true,
})
export class NotificationPermissionInstitutionalConnectionComponent
  implements OnInit {
  _notification: InboxNotificationInstitutional
  @Input()
  set notification(notification: InboxNotificationInstitutional) {
    this._notification = notification
  }
  get notification() {
    return this._notification
  }
  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
