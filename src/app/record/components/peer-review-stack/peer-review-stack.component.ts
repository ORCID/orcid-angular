import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { VisibilityStrings } from '../../../types/common.endpoint'
import {
  PeerReview,
  PeerReviewDuplicateGroup,
} from '../../../types/record-peer-review.endpoint'
import { first } from 'rxjs/operators'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { UserRecord } from 'src/app/types/record.local'

@Component({
  selector: 'app-peer-review-stack',
  templateUrl: './peer-review-stack.component.html',
  styleUrls: [
    './peer-review-stack.component.scss',
    './peer-review-stack.component.scss-theme.scss',
  ],
  standalone: false,
})
export class PeerReviewStackComponent implements OnInit {
  @HostBinding('class.display-the-stack') displayTheStackClass = false
  _peerReviewStack: PeerReviewDuplicateGroup
  visibility: VisibilityStrings
  @Input() isPublicRecord: string
  @Input() userRecord: UserRecord

  @Input()
  set peerReviewStack(value: PeerReviewDuplicateGroup) {
    value.peerReviews = value.peerReviews.map((peerReview) => {
      return { ...peerReview, userIsSource: this.userIsSource(peerReview) }
    })
    this._peerReviewStack = value
    this.putsThePreferredPeerReviewOnTop(value)
    this.setInitialStates(value)
  }

  get peerReviewStack(): PeerReviewDuplicateGroup {
    return this._peerReviewStack
  }

  _displayTheStack = false
  set displayTheStack(mode: boolean) {
    this._displayTheStack = mode
    this.displayTheStackClass = this._displayTheStack
    this.setInitialStates(this._peerReviewStack, true)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }

  @Output() total: EventEmitter<any> = new EventEmitter()

  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  detailsPeerReviews: {
    putCode: number
    peerReview: PeerReview
  }[] = []
  isMobile: boolean
  platform: PlatformInfo

  constructor(
    private _platformInfo: PlatformInfoService,
    private _recordPeerReviewService: RecordPeerReviewService
  ) {
    this._platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
  }

  private putsThePreferredPeerReviewOnTop(value: PeerReviewDuplicateGroup) {
    const peerReviewIndex = value.peerReviews.findIndex((peerRe) => {
      return this.isPreferred(peerRe)
    })

    if (peerReviewIndex) {
      const peerReview = value.peerReviews[peerReviewIndex]
      value.peerReviews.splice(peerReviewIndex, 1)
      value.peerReviews.unshift(peerReview)
    }
  }

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setInitialStates(group: PeerReviewDuplicateGroup, force = false) {
    group.peerReviews.forEach((peerReview) => {
      this.setDefaultPanelsDisplay(peerReview, force)
      this.setDefaultPanelDetailsState(peerReview, force)
    })
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(peerReview: PeerReview, force = false) {
    if (
      this.stackPanelsDisplay[peerReview.putCode.value] === undefined ||
      force
    ) {
      this.stackPanelsDisplay[peerReview.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(peerReview),
      }
    }
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(peerReview: PeerReview, force = false) {
    if (
      this.panelDetailsState[peerReview.putCode.value] === undefined ||
      force
    ) {
      this.panelDetailsState[peerReview.putCode.value] = {
        state: false,
      }
    }
  }

  isPreferred(peerReview: PeerReview) {
    const response =
      peerReview && this.peerReviewStack
        ? this.peerReviewStack.activePutCode.toString() ===
          peerReview.putCode.value
        : false
    return response
  }

  makePrimaryCard(peerReview: PeerReview) {
    this._recordPeerReviewService
      .updatePreferredSource(peerReview.putCode.value)
      .subscribe()
  }

  changeTopPanelOfTheStack(peerReview: PeerReview) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[peerReview.putCode.value].topPanelOfTheStack = true
  }

  trackByPeerReviewStack(index, item: PeerReview) {
    return item.putCode
  }

  ngOnInit(): void {}

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

  userIsSource(peerReview: PeerReview): boolean {
    return (
      this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID === peerReview?.source
    )
  }
}
