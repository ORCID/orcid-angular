import { Component, Input, OnInit } from '@angular/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
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
      // multiple items notifications are not expected for `YOUR-RECORD`
      this._errorHandler.handleError(new Error('notificationUnexpectedLength'))
    }
    this.item = notification.items.items[0]
  }
  get notification() {
    return this._notification
  }
  constructor(private _errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {}

  getAmendedTypeLabel(item: Item) {
    if (item) {
      switch (item.actionType) {
        case 'CREATE':
          return $localize`:@@inbox.newItemAdded:Added`
        case 'UPDATE':
          return $localize`:@@inbox.itemUpdate:Updated`
        case 'DELETE':
          return $localize`:@@inbox.deleteItem:Deleted`
        default:
          return $localize`:@@inbox.otherUpdate:Other`
      }
    }
    return 'Other update'
  }

  getNotificationSectionUpdatedLabel(notification: InboxNotificationAmended) {
    switch (notification.amendedSection) {
      case 'AFFILIATION':
        return $localize`:@@inbox.affiliations:Affiliations`
      case 'BIO':
        return $localize`:@@inbox.bio:Bio`
      case 'DISTINCTION':
        return $localize`:@@inbox.distinction:Distinction`
      case 'EDUCATION':
        return $localize`:@@inbox.education:Education`
      case 'EMPLOYMENT':
        return $localize`:@@inbox.employment:Employment`
      case 'EXTERNAL_IDENTIFIERS':
        return $localize`:@@inbox.externalIdentifiers:External Identifiers`
      case 'FUNDING':
        return $localize`:@@inbox.funding:Funding`
      case 'INVITED_POSITION':
        return $localize`:@@inbox.invitedPosition:Invited Position`
      case 'MEMBERSHIP':
        return $localize`:@@inbox.membership:Membership`
      case 'PEER_REVIEW':
        return $localize`:@@inbox.peerReview:Peer Review`
      case 'PREFERENCES':
        return $localize`:@@inbox.preferences:Preferences`
      case 'QUALIFICATION':
        return $localize`:@@inbox.qualification:Qualification`
      case 'RESEARCH_RESOURCE':
        return $localize`:@@inbox.researchResource:Research Resource`
      case 'SERVICE':
        return $localize`:@@inbox.researchResource:Service`
      case 'WORK':
        return $localize`:@@inbox.work:Work`
      default:
        return $localize`:@@inbox.unknown:unknown`
    }
  }
}
