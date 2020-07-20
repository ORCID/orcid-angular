import { Component, Inject, Input, OnInit } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { InboxNotificationPermission } from 'src/app/types/notifications.endpoint'

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss'],
  preserveWhitespaces: true,
})
export class NotificationPermissionComponent implements OnInit {
  @Input() notification: InboxNotificationPermission

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
