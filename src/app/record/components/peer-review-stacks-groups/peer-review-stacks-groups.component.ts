import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { Subject } from 'rxjs'
import { NameForm, UserInfo } from '../../../types'
import { LegacyOauthRequestInfoForm as RequestInfoForm } from '../../../types/request-info-form.endpoint'
import {
  PeerReview,
  PeerReviewDuplicateGroup,
} from '../../../types/record-peer-review.endpoint'
import { ModalPeerReviewsComponent } from './modals/modal-peer-reviews/modal-peer-reviews.component'
import { SortData } from 'src/app/types/sort'
import {
  MainPanelsState,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'
import { VisibilityStrings } from '../../../types/common.endpoint'
import { isQA } from 'src/app/shared/validators/environment-check/environment-check'

@Component({
  selector: 'app-peer-reviews',
  templateUrl: './peer-review-stacks-groups.component.html',
  styleUrls: [
    './peer-review-stacks-groups.component.scss',
    './peer-review-stacks-groups.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class PeerReviewStacksGroupsComponent implements OnInit {
  regionPeerReviews = $localize`:@@peerReview.peerReviews:Peer reviews`
  labelAddButton = $localize`:@@shared.addPeerReviews:Add Peer Review`
  labelSortButton = $localize`:@@shared.sortPeerReviews:Sort Peer Reviews`

  @Input() userInfo: UserInfo
  @Input() isPublicRecord: string
  @Input() expandedContent: MainPanelsState
  @Output() expandedContentChange = new EventEmitter<MainPanelsState>()

  @Output() expandedPanelChange: EventEmitter<any> = new EventEmitter()
  @Output() total: EventEmitter<any> = new EventEmitter()

  modalPeerReviewComponent = ModalPeerReviewsComponent

  $destroy: Subject<boolean> = new Subject<boolean>()
  userRecordContext: UserRecordOptions = {}
  IS_QA: boolean

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  peerReviews: PeerReview[] = []
  reviewsNumber: number
  platform: PlatformInfo
  detailsPeerReviews: {
    putCode: number
    peerReview: PeerReview
  }[] = []
  isMobile: boolean
  moreInfo: number[] = []

  ngOrcidPeerReview = $localize`:@@peerReview.peerReview:Peer review`
  loading = true

  constructor(
    _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _recordPeerReviewService: RecordPeerReviewService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
        this.isMobile = data.columns4 || data.columns8
      })
  }

  ngOnInit(): void {
    this.getRecord()
    this.IS_QA = isQA()
  }

  trackByPeerReviewGroup(index, item: PeerReviewDuplicateGroup) {
    return item.activePutCode
  }

  private getRecord() {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession
      })

    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.userRecord = userRecord
      })

    // Loads the public record if `isPublicRecord` is defined
    // Otherwise loads the current login private record
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        if (userRecord?.peerReviews !== undefined) {
          this.loading = false
        }
        if (userRecord?.peerReviews !== undefined) {
          this.peerReviews = userRecord.peerReviews
          this.reviewsNumber = 0
          this.peerReviews.forEach((p) => {
            this.reviewsNumber += p.putCodes.length
          })
          this.total.emit(this.peerReviews.length)
        }
      })
  }

  sortEvent(event: SortData) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._recordPeerReviewService.changeUserRecordContext(
      this.userRecordContext
    )
  }

  getDetails(peerReview: PeerReview, putCode: number): void {
    if (this.isPublicRecord) {
      this._recordPeerReviewService
        .getPublicPeerReviewById(this.isPublicRecord, putCode)
        .pipe(first())
        .subscribe(
          (data) => {
            this.detailsPeerReviews.push({ putCode: putCode, peerReview: data })
            peerReview.showDetails = true
          },
          (error) => {
            console.error('getDetailsError', error)
          }
        )
    } else {
      this._recordPeerReviewService
        .getPeerReviewById(putCode)
        .pipe(first())
        .subscribe(
          (data) => {
            this.detailsPeerReviews.push({ putCode: putCode, peerReview: data })
            peerReview.showDetails = true
          },
          (error) => {
            console.error('getDetailsError', error)
          }
        )
    }
  }

  getPeerReview(putCode: number): PeerReview {
    if (this.detailsPeerReviews.length === 0) {
      return null
    }

    return this.detailsPeerReviews
      .filter((value) => value.putCode === putCode)
      .map((value) => {
        return value.peerReview
      })[0]
  }

  getVisibility(peerReview: PeerReview): VisibilityStrings {
    return peerReview.visibility
  }

  collapse(peerReview: PeerReview) {
    peerReview.showDetails = !peerReview.showDetails
  }

  expandedClicked(expanded: boolean, peerReview?: PeerReview) {
    if (peerReview) {
      this.getPeerReviewSummaryByGroupId(peerReview)
    }
  }

  getPeerReviewSummaryByGroupId(peerReview: PeerReview) {
    this._recordPeerReviewService
      .getPeerReviewsByGroupId(
        { publicRecordId: this.isPublicRecord },
        peerReview.groupIdValue
      )
      .pipe(first())
      .subscribe((data) => {
        this.peerReviews.forEach((pR, index) => {
          if (pR.groupId === data[0]?.groupId) {
            const groupedPeerReview = data.filter(
              (value) => value.groupId === pR.groupId
            )[0]
            this.peerReviews[index].type = groupedPeerReview.type
            this.peerReviews[index].description = groupedPeerReview.description
            this.peerReviews[index].groupType = groupedPeerReview.groupType
            this.peerReviews[index].url = groupedPeerReview.url
            this.peerReviews[index].groupIdValue =
              groupedPeerReview.groupIdValue
            this.peerReviews[index].peerReviewDuplicateGroups =
              groupedPeerReview.peerReviewDuplicateGroups
            const visibility =
              groupedPeerReview.peerReviewDuplicateGroups[0].peerReviews[0]
                .visibility.visibility
            groupedPeerReview.peerReviewDuplicateGroups.forEach(
              (peerReviewDuplicateGroup) => {
                const peerReviews = peerReviewDuplicateGroup.peerReviews.filter(
                  (p) => p.visibility.visibility !== visibility
                )
                if (peerReviews.length > 0) {
                  this.peerReviews[index].visibilityError = true
                }
              }
            )
          }
        })
      })
  }

  isQA(): boolean {
    return isQA()
  }
}
