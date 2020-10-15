import { Component, Inject, Input, OnInit } from '@angular/core'
import { InboxNotification, InboxNotificationAmended } from '../../../types/notifications.endpoint'
import { WINDOW } from '../../../cdk/window'
import { environment } from '../../../../environments/environment.local'
import { UserService } from '../../../core'
import { UserInfo } from '../../../types'
import { map, take, takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification-header.component.html',
  styleUrls: ['./notification-header.component.scss'],
  preserveWhitespaces: true
})
export class NotificationHeaderComponent implements OnInit {
  @Input() notification: InboxNotificationAmended
  baseUri: string
  displayName: string
  orcidId: string
  title: string

  constructor(
    @Inject(WINDOW) private window: Window,
    _userInfo: UserService,
  ) {
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

  navigateTo(val) {
    this.window.location.href = val
  }
}
