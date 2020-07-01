import {
  Component,
  OnInit,
  HostBinding,
  Input,
  Inject,
  LOCALE_ID,
} from '@angular/core'
import { InboxNotification } from 'src/app/types/notifications.endpoint'
import { DateAdapter } from '@angular/material/core'
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: [
    './notification.component.scss',
    './notification.component.scss-theme.scss',
  ],
})
export class NotificationComponent implements OnInit {
  @HostBinding('class.archived') archived = false
  @HostBinding('class.green') green = false
  @HostBinding('class.orange') orange = true
  @HostBinding('class.blue') blue = false
  @Input() notification: InboxNotification

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  notificationTypeLabel(notification: InboxNotification) {
    switch (notification.notificationType) {
      case 'AMENDED':
        return 'YOUR RECORD'
      case 'PERMISSION':
        return 'PERMISSIONS'
      default:
        return 'ANNOUNCEMENT'
    }
  }

  // Used to select which body component to load for each notification
  notificationType(notification: InboxNotification) {
    switch (notification.notificationType) {
      case 'AMENDED':
        return 'your-record'
      case 'PERMISSION':
        return 'permission'
      default:
        return 'announcement'
    }
  }

  notificationTitle(notification: InboxNotification) {
    return `${notification.source.sourceName.content} has made changes to your ORCID record`
  }

  notificationDate(notification: InboxNotification) {
    const date = new Date(notification.createdDate)
    return date.toLocaleDateString(this.locale)
  }

  ngOnInit(): void {}
}
