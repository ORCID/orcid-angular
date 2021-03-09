import { Component, Input, OnInit } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { Subject } from 'rxjs'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import { PeerReview } from '../../../types/record-peer-review.endpoint'

@Component({
  selector: 'app-peer-reviews',
  templateUrl: './peer-reviews.component.html',
  styleUrls: ['./peer-reviews.component.scss'],
  preserveWhitespaces: true,
})
export class PeerReviewsComponent implements OnInit {
  @Input() publicView: any = false

  $destroy: Subject<boolean> = new Subject<boolean>()

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  platform: PlatformInfo
  detailsPeerReviews: PeerReview[] = []

  constructor(
    _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _recordPeerReviewService: RecordPeerReviewService,
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession

        // TODO @amontenegro
        // AVOID requiring the orcid url to getPerson to call all the record data on parallel
        this._record
          .getRecord(this.userSession.userInfo.EFFECTIVE_USER_ORCID)
          .pipe(takeUntil(this.$destroy))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
          })
      })
  }

  getDetails(putCode: number): void {
    console.log(putCode)
    if (this.publicView) {
      this._recordPeerReviewService.getPublicPeerReviewById(this.userSession.userInfo.EFFECTIVE_USER_ORCID, putCode)
        .pipe(first())
        .subscribe(
          data => {
            this.detailsPeerReviews[putCode] = data
          },
          error => {
            console.log('getDetailsError', error)
          },
        )
    } else {
      this._recordPeerReviewService.getPeerReviewById(putCode)
        .pipe(first())
        .subscribe(
          data => {
            this.detailsPeerReviews[putCode] = data
          },
          error => {
            console.log('getDetailsError', error)
          },
        )
    }
  }
}
