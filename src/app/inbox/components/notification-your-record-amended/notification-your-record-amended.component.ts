import { Component, Input, OnInit } from '@angular/core'
import {
  InboxNotificationAmended,
  Item,
} from 'src/app/types/notifications.endpoint'

@Component({
  selector: 'app-notification-your-record-amended',
  templateUrl: './notification-your-record-amended.component.html',
  styleUrls: ['./notification-your-record-amended.component.scss'],
  preserveWhitespaces: true,
})
export class NotificationYourRecordAmendedComponent implements OnInit {
  private _notification: InboxNotificationAmended
  item: Item
  @Input()
  set notification(notification: InboxNotificationAmended) {
    this._notification = notification
    if (notification.items.items.length >= 1) {
      // TODO leomendoza123 throw error
      // multiple items notifications are not expected for `YOUR-RECORD`
    }
    this.item = notification.items.items[0]
  }
  get notification() {
    return this._notification
  }
  constructor() {}

  ngOnInit(): void {}

  getAmendedTypeLabel(item: Item) {
    if (item) {
      switch (item.actionType) {
        case 'CREATE':
          return $localize`:@@inbox.newItemAdded:New item added`
        case 'UPDATE':
          return $localize`:@@inbox.itemUpdate:Item updated`
        case 'DELETE':
          return $localize`:@@inbox.deleteItem:Deleted item`
        default:
          return $localize`:@@inbox.otherUpdate:Other update`
      }
    }
    return 'Other update'
  }

  getNotificationSectionUpdatedLabel(notification: InboxNotificationAmended) {
    switch (notification.amendedSection) {
      case 'AFFILIATION':
        return $localize`:@@inbox.affiliations:affiliations`
      case 'BIO':
        return $localize`:@@inbox.bio:bio`
      case 'EDUCATION':
        return $localize`:@@inbox.education:education`
      case 'EMPLOYMENT':
        return $localize`:@@inbox.employment:employment`
      case 'EXTERNAL_IDENTIFIERS':
        return $localize`:@@inbox.externalIdentifiers:external identifiers`
      case 'FUNDING':
        return $localize`:@@inbox.funding:funding`
      case 'PEER_REVIEW':
        return $localize`:@@inbox.peerReview:peer review`
      case 'PREFERENCES':
        return $localize`:@@inbox.preferences:preferences`
      case 'RESEARCH_RESOURCE':
        return $localize`:@@inbox.researchResource:research resource`
      case 'WORK':
        return $localize`:@@inbox.work:work`
      default:
        return $localize`:@@inbox.unknown:unknown`
    }
  }
}
