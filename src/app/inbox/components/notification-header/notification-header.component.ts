import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  InboxNotification,
  InboxNotificationAmended,
} from '../../../types/notifications.endpoint'
import { WINDOW } from '../../../cdk/window'
import { environment } from '../../../../environments/environment.local'
import { UserService } from '../../../core'
import { take } from 'rxjs/operators'
import { uiNotificationType } from '../../../types/notifications.local'

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification-header.component.html',
  styleUrls: [
    './notification-header.component.scss',
    './notification-header.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class NotificationHeaderComponent implements OnInit {
  @Input() notification: InboxNotificationAmended
  @ViewChild('header') header: ElementRef<HTMLElement>
  @HostBinding('class.archived') _archived = false
  @HostBinding('class.green') green = false
  @HostBinding('class.orange') orange = true
  @HostBinding('class.blue') blue = false
  notificationType: uiNotificationType
  baseUri: string
  displayName: string
  orcidId: string
  title: string

  constructor(@Inject(WINDOW) private window: Window, _userInfo: UserService) {
    _userInfo
      .getUserSession()
      .pipe(take(1))
      .subscribe((userInfo) => {
        this.displayName = userInfo.displayName
        this.orcidId = userInfo.userInfo.REAL_USER_ORCID
      })

    this.baseUri = 'https:' + environment.BASE_URL
  }

  ngOnInit(): void {
    this.title = this.notificationTitle(this.notification)
    this.notificationType = this.getNotificationType(this.notification)
    this.setNotificationColor(this.notificationType)
  }

  notificationTitle(notification: InboxNotification) {
    switch (notification.notificationType) {
      case 'AMENDED':
        return `${
          notification.source.sourceName.content
        } ${$localize`:@@inbox.hadMadeChanges:has made changes to your ORCID record`}`
      case 'INSTITUTIONAL_CONNECTION':
        return `${$localize`:@@inbox.connectingAn:Connecting an`} ${
          notification.source.sourceName.content
        } ${$localize`:@@inbox.accountWithYourOrcid:account with your ORCID record`}`

      case 'PERMISSION':
        // The subject of the permission request is define by the member with the API
        return `${notification.subject}`
      default:
        // any subject for HTML notifications define on the backend is define on the backend
        return `${notification.subject}`
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

  notificationTypeLabel(notificationType: uiNotificationType) {
    switch (notificationType) {
      case 'your-record':
        return $localize`:@@inbox.yourRecord:YOUR RECORD`
      case 'permission':
        return $localize`:@@inbox.permissions:PERMISSIONS`
      default:
        return $localize`:@@inbox.announcement:ANNOUNCEMENT`
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
