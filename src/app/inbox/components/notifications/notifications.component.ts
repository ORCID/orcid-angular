import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { InboxNotification } from 'src/app/types/notifications.endpoint'
import { InboxService } from 'src/app/core/inbox/inbox.service'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  $notifications: Observable<InboxNotification[]>

  constructor(private _inbox: InboxService) {
    this.$notifications = _inbox.getNotifications()
  }

  ngOnInit(): void {}
}
