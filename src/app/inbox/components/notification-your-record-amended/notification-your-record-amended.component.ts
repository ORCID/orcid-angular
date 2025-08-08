import { Component, Input, OnInit } from '@angular/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import {
  InboxNotificationAmended,
  Item,
} from 'src/app/types/notifications.endpoint'
import { chain } from 'lodash'

@Component({
    selector: 'app-notification-your-record-amended',
    templateUrl: './notification-your-record-amended.component.html',
    styleUrls: ['./notification-your-record-amended.component.scss'],
    preserveWhitespaces: true,
    standalone: false
})
export class NotificationYourRecordAmendedComponent implements OnInit {
  private _notification: InboxNotificationAmended
  item: Item[]
  itemGroupedByType: { type: string; items: Item[] }[]
  @Input()
  set notification(notification: InboxNotificationAmended) {
    this._notification = notification
    if (notification.items.items.length >= 1) {
      // multiple items notifications are not expected for `YOUR-RECORD`
      this._errorHandler.handleError(new Error('notificationUnexpectedLength'))
    }
    this.item = notification.items.items
  }
  get notification() {
    return this._notification
  }
  constructor(private _errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.itemGroupedByType = chain(this.notification?.items.items)
      .groupBy('actionType')
      .map((value, key) => ({ type: key, items: value }))
      .value()
  }

  getAmendedTypeLabel(type: string) {
    if (type) {
      switch (type) {
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

  isProfessionalActivity(notification: InboxNotificationAmended) {
    switch (notification?.amendedSection) {
      case 'DISTINCTION':
        return true
      case 'INVITED_POSITION':
        return true
      case 'MEMBERSHIP':
        return true
      case 'SERVICE':
        return true
      default:
        return false
    }
  }

  getNotificationSectionUpdatedLabel(notification: InboxNotificationAmended) {
    switch (notification?.amendedSection) {
      case 'AFFILIATION':
        return $localize`:@@inbox.affiliations:Affiliations`
      case 'BIO':
        return $localize`:@@inbox.bio:Bio`
      case 'DISTINCTION':
        return $localize`:@@inbox.professionalActivities:Professional activities`
      case 'EDUCATION':
        return $localize`:@@inbox.education:Education`
      case 'EMPLOYMENT':
        return $localize`:@@inbox.employment:Employment`
      case 'EXTERNAL_IDENTIFIERS':
        return $localize`:@@inbox.externalIdentifiers:External Identifiers`
      case 'FUNDING':
        return $localize`:@@inbox.funding:Funding`
      case 'INVITED_POSITION':
        return $localize`:@@inbox.professionalActivities:Professional activities`
      case 'MEMBERSHIP':
        return $localize`:@@inbox.professionalActivities:Professional activities`
      case 'PEER_REVIEW':
        return $localize`:@@inbox.peerReview:Peer Review`
      case 'PREFERENCES':
        return $localize`:@@inbox.preferences:Preferences`
      case 'QUALIFICATION':
        return $localize`:@@inbox.qualification:Qualification`
      case 'RESEARCH_RESOURCE':
        return $localize`:@@inbox.researchResource:Research Resource`
      case 'SERVICE':
        return $localize`:@@inbox.professionalActivities:Professional activities`
      case 'WORK':
        return $localize`:@@inbox.work:Work`
      default:
        return $localize`:@@inbox.unknown:unknown`
    }
  }

  getProfessionalActivitiesUpdatedLabel(
    notification: InboxNotificationAmended
  ) {
    switch (notification?.amendedSection) {
      case 'DISTINCTION':
        return $localize`:@@inbox.distinction:Distinction`.toUpperCase()
      case 'INVITED_POSITION':
        return $localize`:@@inbox.invitedPosition:Invited Position`.toUpperCase()
      case 'MEMBERSHIP':
        return $localize`:@@inbox.membership:Membership`.toUpperCase()
      case 'SERVICE':
        return $localize`:@@inbox.service:Service`.toUpperCase()
      default:
        return ''
    }
  }
}
