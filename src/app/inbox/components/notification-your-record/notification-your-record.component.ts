import { Component, OnInit, Input } from '@angular/core'
import {
  InboxNotification,
  InboxNotificationAmended,
  Item,
} from 'src/app/types/notifications.endpoint'

@Component({
  selector: 'app-notification-your-record',
  templateUrl: './notification-your-record.component.html',
  styleUrls: ['./notification-your-record.component.scss'],
})
export class NotificationYourRecordComponent implements OnInit {
  private _notification: InboxNotificationAmended
  item: Item
  @Input()
  set notification(notification: InboxNotificationAmended) {
    this._notification = notification
    if (notification.items.items.length !== 1) {
      // TODO leomendoza123 throw error
      // multiple items notifications are not expected for `YOUR-RECORD`
      console.log('MORE THAN ONE')
    }
    this.item = notification.items.items[0]
  }
  get notification() {
    return this._notification
  }
  constructor() {}

  ngOnInit(): void {}

  getAmendedTypeLabel(item: Item) {
    switch (item.actionType) {
      case 'CREATE':
        return 'New items added'
      case 'UPDATE':
        return 'Items updated'
      case 'DELETE':
        return 'Deleted items'
      default:
        return 'Other updates'
    }
  }

  getNotificationSectionUpdatedLabel(notification: InboxNotificationAmended) {
    switch (notification.amendedSection) {
      case 'AFFILIATION':
        return 'affiliations'
      case 'BIO':
        return 'bio'
      case 'EDUCATION':
        return 'education'
      case 'EMPLOYMENT':
        return 'employment'
      case 'EXTERNAL_IDENTIFIERS':
        return 'external identifiers'
      case 'FUNDING':
        return 'funding'
      case 'PEER_REVIEW':
        return 'peer review'
      case 'PREFERENCES':
        return 'preferences'
      case 'RESEARCH_RESOURCE':
        return 'research resource'
      case 'WORK':
        return 'work'
      default:
        return 'unknown'
    }
  }
}
