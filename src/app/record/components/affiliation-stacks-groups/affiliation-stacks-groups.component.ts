import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import {
  AffiliationGroup,
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
} from 'src/app/types/record-affiliation.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliation-stacks-groups.component.html',
  styleUrls: ['./affiliation-stacks-groups.component.scss'],
})
export class AffiliationStacksGroupsComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() isPublicRecord: string = null
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()

  profileAffiliationUiGroups: AffiliationUIGroup[]
  userSession: UserSession
  userRecord: UserRecord

  affiliationsCount: number

  constructor(
    private _userSession: UserService,
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.userRecord = userRecord
        this.profileAffiliationUiGroups = this.userRecord.affiliations
        this.affiliationsCount =
          this.getAffiliationType('EMPLOYMENT')?.affiliationGroup.length +
          this.getAffiliationType('EDUCATION_AND_QUALIFICATION')
            ?.affiliationGroup.length +
          this.getAffiliationType('INVITED_POSITION_AND_DISTINCTION')
            ?.affiliationGroup.length +
          this.getAffiliationType('MEMBERSHIP_AND_SERVICE')?.affiliationGroup
            .length
        this.total.emit(this.affiliationsCount)
      })
  }

  trackByProfileAffiliationUiGroups(index, item: AffiliationUIGroup) {
    return item.type
  }

  trackByAffiliationGroup(index, item: AffiliationGroup) {
    return item.activePutCode
  }

  affiliationTypeLabel(affiliationType: string) {
    switch (affiliationType) {
      case AffiliationUIGroupsTypes.EMPLOYMENT:
        return $localize`:@@shared.employment:Employment`
      case AffiliationUIGroupsTypes.EDUCATION_AND_QUALIFICATION:
        return $localize`:@@shared.educationQualifications:Education and qualifications`
      case AffiliationUIGroupsTypes.INVITED_POSITION_AND_DISTINCTION:
        return $localize`:@@shared.invitedPositions:Invited positions and distinctions`
      case AffiliationUIGroupsTypes.MEMBERSHIP_AND_SERVICE:
        return $localize`:@@shared.membership:Membership and service`
    }
  }

  getAffiliationType(type: string): AffiliationUIGroup {
    if (this.profileAffiliationUiGroups) {
      return this.profileAffiliationUiGroups.filter((affiliation) => {
        return affiliation.type === type
      })[0]
    }
  }
}
