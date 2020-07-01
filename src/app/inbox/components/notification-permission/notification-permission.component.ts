import { Component, OnInit } from '@angular/core'
import { InboxNotificationPermission } from 'src/app/types/notifications.endpoint'

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss'],
})
export class NotificationPermissionComponent implements OnInit {
  private notification: InboxNotificationPermission

  constructor() {}

  ngOnInit(): void {}
}
