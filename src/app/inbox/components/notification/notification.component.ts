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
import { uiNotificationType } from 'src/app/types/notifications.local'
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
  _notification: InboxNotification
  notificationLabel: string
  notificationType: uiNotificationType
  @Input()
  set notification(notification: InboxNotification) {
    this._notification = notification
    this.notificationType = this.getNotificationType(notification)
    this.setNotificationColor(this.notificationType)
  }
  get notification() {
    return this._notification
  }

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  notificationTypeLabel(notificationType: uiNotificationType) {
    switch (notificationType) {
      case 'your-record':
        return 'YOUR RECORD'
      case 'permission':
        return 'PERMISSIONS'
      default:
        return 'ANNOUNCEMENT'
    }
  }

  getNotificationType(notification: InboxNotification): uiNotificationType {
    switch (notification.notificationType) {
      case 'AMENDED':
        return 'your-record'
      case 'ADMINISTRATIVE':
        return 'your-record'
      case 'PERMISSION':
        return 'permission'
      case 'INSTITUTIONAL_CONNECTION':
        return 'permission'
      default:
        return 'announcement'
    }
  }

  notificationTitle(notification: InboxNotification) {
    switch (notification.notificationType) {
      case 'AMENDED':
        return `${notification.source.sourceName.content} has made changes to your ORCID record`
      case 'ADMINISTRATIVE':
        return `${notification.subject}`
      case 'PERMISSION':
        return `${notification.subject}`
      case 'INSTITUTIONAL_CONNECTION':
        return `Connecting an ${notification.source.sourceName.content} account with your ORCID record`
      default:
        return 'DEFINE'
    }
  }

  notificationDate(notification: InboxNotification) {
    const date = new Date(notification.createdDate)
    return date.toLocaleDateString(this.locale)
  }

  setNotificationColor(type: uiNotificationType) {
    this.blue = false
    this.orange = false
    this.green = false
    switch (type) {
      case 'your-record':
        this.green = true
        break
      case 'permission':
        this.orange = true
        break
      case 'announcement':
        this.blue = true
        break
    }
  }

  ngOnInit(): void {}
}
