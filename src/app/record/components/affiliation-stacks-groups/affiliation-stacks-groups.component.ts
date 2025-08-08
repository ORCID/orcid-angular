import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { isEmpty } from 'lodash'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import {
  AffiliationGroup,
  AffiliationType,
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
} from 'src/app/types/record-affiliation.endpoint'
import {
  MainPanelsState,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'
import { SortData, SortOrderType } from 'src/app/types/sort'

import { UserInfo } from '../../../types'

@Component({
    selector: 'app-affiliations',
    templateUrl: './affiliation-stacks-groups.component.html',
    styleUrls: ['./affiliation-stacks-groups.component.scss'],
    standalone: false
})
export class AffiliationStacksGroupsComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  regionAffiliations = $localize`:@@ngOrcid.signin.affiliations:Affiliations`
  regionProfessionalActivities = $localize`:@@shared.professionalActivities:Professional activities`
  labelAddEmploymentButton = $localize`:@@shared.addEmployment:Add Employment`
  labelSortEmploymentButton = $localize`:@@shared.sortEmployments:Sort Employments`
  labelEducationAddButton = $localize`:@@shared.addEducation:Add Education`
  labelEducationSortButton = $localize`:@@shared.sortEducation:Sort Education`
  labelInvitedAddButton = $localize`:@@shared.addInvited:Add Invited Position`
  labelInvitedSortButton = $localize`:@@shared.sortInvited:Sort Invited Positions`
  labelMembershipAddButton = $localize`:@@shared.addMembership:Add Membership`
  labelMembershipSortButton = $localize`:@@shared.sortMemberships:Sort Memberships`
  userRecordContext: UserRecordOptions = {}
  @Input() userInfo: UserInfo
  @Input() isPublicRecord: string = null
  @Output() total: EventEmitter<any> = new EventEmitter()

  profileAffiliationUiGroups: AffiliationUIGroup[]
  affiliationUIGroupsTypes: AffiliationUIGroupsTypes
  affiliationType = AffiliationType
  userRecord: UserRecord

  affiliationsCount: number
  $loading: Observable<boolean>
  @Input() expandedContent: MainPanelsState
  @Output()
  expandedContentChange: EventEmitter<MainPanelsState> = new EventEmitter()
  sortTypes: SortOrderType[] = ['title', 'start', 'end', 'source']
  professionalActivitiesSortTypes: SortOrderType[] = [
    'title',
    'type',
    'start',
    'end',
    'source',
  ]
  educationAndQualificationSortTypes: SortOrderType[] = [
    'title',
    'start',
    'end',
    'source',
  ]
  constructor(
    private _record: RecordService,
    private _recordAffiliationService: RecordAffiliationService
  ) {}

  ngOnInit(): void {
    this.$loading = this._recordAffiliationService.$loading
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        if (!isEmpty(userRecord?.affiliations)) {
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
          const professionalActivities = this.profileAffiliationUiGroups.find(
            (profileAffiliation) =>
              profileAffiliation.type === 'PROFESSIONAL_ACTIVITIES'
          )
          if (!professionalActivities) {
            this.profileAffiliationUiGroups.push({
              type: 'PROFESSIONAL_ACTIVITIES',
              affiliationGroup: [
                ...this.getAffiliationType('INVITED_POSITION_AND_DISTINCTION')
                  ?.affiliationGroup,
                ...this.getAffiliationType('MEMBERSHIP_AND_SERVICE')
                  ?.affiliationGroup,
              ],
            })
            this.sortEvent(
              { type: 'end', direction: 'desc' },
              'PROFESSIONAL_ACTIVITIES'
            )
          }
        }
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
      case AffiliationUIGroupsTypes.PROFESSIONAL_ACTIVITIES:
        return $localize`:@@shared.professionalActivities:Professional activities`
    }
  }

  getAffiliationType(type: string): AffiliationUIGroup {
    if (this.profileAffiliationUiGroups) {
      return this.profileAffiliationUiGroups.filter((affiliation) => {
        return affiliation.type === type
      })[0]
    }
  }

  sortEvent(event: SortData, type: string) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.privateRecordId =
      this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._recordAffiliationService.changeUserRecordContext(
      this.userRecordContext,
      type
    )
  }
}
