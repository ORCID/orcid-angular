import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { Subject } from 'rxjs'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'
import {
  PeerReview,
  PeerReviewDuplicateGroup,
} from '../../../types/record-peer-review.endpoint'
import { ModalPeerReviewsComponent } from './modals/modal-peer-reviews/modal-peer-reviews.component'
import { isEmpty } from 'lodash'
import { SortData } from 'src/app/types/sort'
import {
  MainPanelsState,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'
import { VisibilityStrings } from '../../../types/common.endpoint'
import {
  isQA
} from 'src/app/shared/validators/environment-check/environment-check'

@Component({
  selector: 'app-peer-reviews',
  templateUrl: './peer-review-stacks-groups.component.html',
  styleUrls: [
    './peer-review-stacks-groups.component.scss',
    './peer-review-stacks-groups.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class PeerReviewStacksGroupsComponent implements OnInit {
  labelAddButton = $localize`:@@shared.addPeerReviews:Add Peer Review`
  labelSortButton = $localize`:@@shared.sortPeerReviews:Sort Peer Reviews`
  @Input() userInfo: UserInfo
  @Input() isPublicRecord: string
  @Input() expandedContent: MainPanelsState
  @Output() expandedContentChange = new EventEmitter<MainPanelsState>()

  @Output() total: EventEmitter<any> = new EventEmitter()

  modalPeerReviewComponent = ModalPeerReviewsComponent

  $destroy: Subject<boolean> = new Subject<boolean>()
  userRecordContext: UserRecordOptions = {}
  IS_QA:  boolean

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
        if (!isEmpty(userRecord?.peerReviews)) {
          this.peerReviews = userRecord.peerReviews
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
    // Validate if there are not different types of visibilities between the Peer Reviews other wise display the error
    const visibility =
      peerReview.peerReviewDuplicateGroups[0].peerReviews[0].visibility
        .visibility
    peerReview.peerReviewDuplicateGroups.forEach((peerReviewDuplicateGroup) => {
      const peerReviews = peerReviewDuplicateGroup.peerReviews.filter(
        (p) => p.visibility.visibility !== visibility
      )
      if (peerReviews.length > 0) {
        peerReview.visibilityError = true
      }
    })

    return visibility
  }

  collapse(peerReview: PeerReview) {
    peerReview.showDetails = !peerReview.showDetails
  }

  expandedClicked(expanded: boolean, peerReview?: PeerReview) {
    if (peerReview) {
      if (expanded) {
        if (!this.moreInfo.includes(peerReview.groupId)) {
          this.moreInfo.push(peerReview.groupId)
        }
      } else {
        this.moreInfo = this.moreInfo.filter((p) => p !== peerReview.groupId)
      }
    }
  }

  isQA(): boolean {
    return isQA()
  }
}
