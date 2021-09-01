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
import { UserRecordOptions } from 'src/app/types/record.local'

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
  @Input() isPublicRecord: string
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()

  modalPeerReviewComponent = ModalPeerReviewsComponent

  $destroy: Subject<boolean> = new Subject<boolean>()
  userRecordContext: UserRecordOptions = {}

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  peerReviews: PeerReview[] = []
  platform: PlatformInfo
  detailsPeerReviews: {
    putCode: number
    peerReview: PeerReview
  }[] = []
  isMobile: boolean

  ngOrcidPeerReview = $localize`:@@peerReview.peerReview:Peer review`

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

    // Loads the public record if `isPublicRecord` is defined
    // Otherwise loads the current login private record
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
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

  collapse(peerReview: PeerReview) {
    peerReview.showDetails = !peerReview.showDetails
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'peer-review', expanded })
  }
}
