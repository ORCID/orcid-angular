import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { isEmpty } from 'lodash'
import { Observable, Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/core/togglz/togglz-flags.enum'
import {
  Affiliation,
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
import { PlatformInfoService } from '../../../cdk/platform-info'

import { UserInfo } from '../../../types'

@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliation-stacks-groups.component.html',
  styleUrls: ['./affiliation-stacks-groups.component.scss'],
  standalone: false,
  preserveWhitespaces: true,
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
  showFeaturedSuccessAlert = false
  featuredAffiliationName = ''
  showFeaturedNoticeAlert = false
  bannerCaptionEnabled = false
  constructor(
    private _record: RecordService,
    private _recordAffiliationService: RecordAffiliationService,
    private _platform: PlatformInfoService,
    private _togglz: TogglzService
  ) {}

  ngOnInit(): void {
    this.$loading = this._recordAffiliationService.$loading

    this._togglz
      .getStateOf(TogglzFlag.FEATURED_AFFILIATIONS)
      .pipe(takeUntil(this.$destroy))
      .subscribe((enabled) => {
        this.bannerCaptionEnabled = !!enabled
        if (!enabled) {
          this.showFeaturedSuccessAlert = false
          this.showFeaturedNoticeAlert = false
        }
      })

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

          // Ensure alerts are in sync with current featured affiliation state.
          // If the previously featured affiliation has been removed (e.g. deleted),
          // clear the success alert so the notice alert logic can run correctly.
          const hasFeaturedAffiliation = !!this.findFeaturedAffiliation()
          if (!hasFeaturedAffiliation) {
            this.showFeaturedSuccessAlert = false
            this.featuredAffiliationName = ''
          }

          // Check for featured affiliation after affiliations are loaded
          this.checkForFeaturedAffiliationOnRegistration()
          // Check if notice alert should be shown (no featured affiliation)
          this.checkForFeaturedNoticeAlert()
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

  onFeaturedToggled(event: { affiliationName: string; featured: boolean }) {
    if (!this.bannerCaptionEnabled) {
      return
    }
    if (event.featured) {
      this.featuredAffiliationName = event.affiliationName
      this.showFeaturedSuccessAlert = true
      this.showFeaturedNoticeAlert = false
    } else {
      // When featured is removed, hide the success alert and clear name,
      // then check if the notice should be shown
      this.showFeaturedSuccessAlert = false
      this.featuredAffiliationName = ''
      this.checkForFeaturedNoticeAlert()
    }
  }

  dismissAlert() {
    this.showFeaturedSuccessAlert = false
    this.featuredAffiliationName = ''
    // Check if notice alert should be shown after dismissing success alert
    this.checkForFeaturedNoticeAlert()
  }

  private checkForFeaturedAffiliationOnRegistration() {
    // Only check if banner caption is enabled
    if (!this.bannerCaptionEnabled) {
      return
    }
    // Only check if we haven't already shown the alert and affiliations are loaded
    if (this.showFeaturedSuccessAlert || !this.userRecord?.affiliations) {
      return
    }

    // Check if justRegistered query parameter exists
    this._platform
      .get()
      .pipe(first(), takeUntil(this.$destroy))
      .subscribe((platform) => {
        if (platform.queryParameters.hasOwnProperty('justRegistered')) {
          const featuredAffiliation = this.findFeaturedAffiliation()
          if (featuredAffiliation) {
            this.featuredAffiliationName =
              featuredAffiliation.affiliationName?.value || ''
            this.showFeaturedSuccessAlert = true
          }
        }
      })
  }

  private findFeaturedAffiliation(): Affiliation | null {
    if (!this.profileAffiliationUiGroups) {
      return null
    }

    // Find the EMPLOYMENT group
    const employmentGroup = this.getAffiliationType('EMPLOYMENT')
    if (!employmentGroup || !employmentGroup.affiliationGroup) {
      return null
    }

    // Find featured employment in all affiliation groups
    for (const group of employmentGroup.affiliationGroup) {
      if (group.affiliations) {
        const featuredAffiliation = group.affiliations.find(
          (affiliation) =>
            affiliation.featured === true &&
            affiliation.affiliationType?.value === 'employment'
        )

        if (featuredAffiliation) {
          return featuredAffiliation
        }
      }
    }

    return null
  }

  private checkForFeaturedNoticeAlert() {
    // Only show notice if banner caption is enabled
    if (!this.bannerCaptionEnabled) {
      this.showFeaturedNoticeAlert = false
      return
    }
    // Only show notice if:
    // 1. Not showing success alert
    // 2. There are employment affiliations
    // 3. No featured affiliation exists
    // 4. Not a public record (users can only highlight on their own record)
    if (
      this.showFeaturedSuccessAlert ||
      !this.userRecord?.affiliations ||
      this.isPublicRecord
    ) {
      this.showFeaturedNoticeAlert = false
      return
    }

    const employmentGroup = this.getAffiliationType('EMPLOYMENT')
    if (!employmentGroup || employmentGroup.affiliationGroup.length === 0) {
      this.showFeaturedNoticeAlert = false
      return
    }

    // Check if there's any featured affiliation
    const featuredAffiliation = this.findFeaturedAffiliation()
    this.showFeaturedNoticeAlert = !featuredAffiliation
  }
}
