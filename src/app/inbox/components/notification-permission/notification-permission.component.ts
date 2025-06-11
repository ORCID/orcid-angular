import { Component, Inject, Input, OnInit } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import {
  InboxNotificationPermission,
  Item,
} from 'src/app/types/notifications.endpoint'
import { chain } from 'lodash'
import { InboxService } from '../../../core/inbox/inbox.service'

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss'],
  preserveWhitespaces: true,
})
export class NotificationPermissionComponent implements OnInit {
  @Input() notification: InboxNotificationPermission
  itemsByType: { type: string; items: Item[] }[]
  isOrcidIntegration: boolean = false
  orcidIntegrationLink: string
  orcidIntegrationMemberName: string

  constructor(
    @Inject(WINDOW) private window: Window,
    private _inbox: InboxService
  ) {}

  ngOnInit(): void {
    if (this.notification?.notificationIntro?.includes('::')) {
      ;[this.orcidIntegrationMemberName, this.orcidIntegrationLink] =
        this.notification.notificationIntro.split('::')
      this.isOrcidIntegration = true
    }
    this.itemsByType = chain(this.notification?.items.items)
      .groupBy('itemType')
      .map((value, key) => ({ type: key, items: value }))
      .value()
  }

  getNotificationType(type: string) {
    switch (type) {
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
        return $localize`:@@inbox.service:Service`
      case 'WORK':
        return $localize`:@@inbox.work:Work`
      default:
        return $localize`:@@inbox.unknown:unknown`
    }
  }

  archive() {
    this._inbox.flagAsArchive(this.notification.putCode).subscribe()
  }
}
