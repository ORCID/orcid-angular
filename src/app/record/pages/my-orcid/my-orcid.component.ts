import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { ORCID_REGEXP } from 'src/app/constants'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from '../../../core/record/record.service'
import { Subject } from 'rxjs'
import { MainPanelsState, UserRecord } from '../../../types/record.local'
import { OpenGraphService } from 'src/app/core/open-graph/open-graph.service'
import { RobotsMetaTagsService } from 'src/app/core/robots-meta-tags/robots-meta-tags.service'
import { UserInfoService } from '../../../core/user-info/user-info.service'
import { UserInfo } from '../../../types'

@Component({
  selector: 'app-my-orcid',
  templateUrl: './my-orcid.component.html',
  styleUrls: [
    './my-orcid.component.scss',
    './my-orcid.component.scss-theme.scss',
  ],
})
export class MyOrcidComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  platform: PlatformInfo
  publicOrcid: string
  affiliations: number
  userInfo: UserInfo
  userRecord: UserRecord
  expandedContent: MainPanelsState = {
    EMPLOYMENT: true,
    EDUCATION_AND_QUALIFICATION: true,
    INVITED_POSITION_AND_DISTINCTION: true,
    MEMBERSHIP_AND_SERVICE: true,
    FUNDING: true,
    PEER_REVIEW: true,
    RESEARCH_RESOURCE: true,
    WORK: true,
  }

  researchResourcePresent: boolean

  expandedButton = true

  recordWithIssues: boolean
  userNotFound: boolean
  loadingUserRecord: boolean
  globalExpandState = true

  constructor(
    _userInfoService: UserInfoService,
    private _platform: PlatformInfoService,
    private route: ActivatedRoute,
    private _record: RecordService,
    private _openGraph: OpenGraphService,
    private _robotsMeta: RobotsMetaTagsService
  ) {
    this.checkIfThisIsAPublicOrcid()
  }

  private checkIfThisIsAPublicOrcid() {
    if (this.getRouteOrcidID()) {
      return (this.publicOrcid = this.getRouteOrcidID())
    }
    return undefined
  }

  private getRouteOrcidID(): string {
    // checks first and second URL segment to find
    // `/qa/<orcid-id>` (used only during QA )
    // od `/<orcid-id>` (used while the app is live )
    if (this.route.parent.snapshot.url) {
      const firstParameter = this.route.parent.snapshot.url[0]
      const secondParameter = this.route.parent.snapshot.url[1]
      if (
        firstParameter &&
        firstParameter.toString() &&
        ORCID_REGEXP.test(firstParameter.toString())
      ) {
        return firstParameter.toString()
      } else if (
        secondParameter &&
        secondParameter.toString() &&
        ORCID_REGEXP.test(secondParameter.toString())
      ) {
        return secondParameter.toString()
      }
      return null
    }
  }

  ngOnInit(): void {
    this.affiliations = 0
    this._platform.get().subscribe((value) => (this.platform = value))
    this._record
      .getRecord({
        publicRecordId: this.publicOrcid || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.userInfo = userRecord?.userInfo
        this.checkLoadingState(userRecord)
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        this.userNotFound = userRecord?.userInfo?.USER_NOT_FOUND
        this.userRecord = userRecord
        if (this.publicOrcid && (this.recordWithIssues || this.userNotFound)) {
          this._robotsMeta.disallowRobots()
        }
        this._openGraph.addOpenGraphData(userRecord)
      })
  }

  ngOnDestroy(): void {
    if (this.publicOrcid) {
      this._openGraph.removeOpenGraphData()
      this._robotsMeta.restoreEnvironmentRobotsConfig()
    }
  }

  switchPanelsState() {
    this.globalExpandState = !this.globalExpandState
    Object.keys(this.expandedContent).forEach((key) => {
      this.expandedContent[key] = this.globalExpandState
    })
  }

  expandedContentUpdate(expandedContent: MainPanelsState) {
    this.globalExpandState = !Object.keys(expandedContent)
      .filter((x) => x !== 'RESEARCH_RESOURCE' || this.researchResourcePresent)
      .map((key) => expandedContent[key])
      .some((x) => !x)
  }

  affiliationsCount(itemsCount: number, type?: string) {
    this.affiliations = this.affiliations + +itemsCount
    if (type === 'RESEARCH_RESOURCE') {
      this.researchResourcePresent = !!itemsCount
    }
  }

  checkLoadingState(userRecord: UserRecord) {
    const missingValues = Object.keys(userRecord).filter((key) => {
      if (key !== 'preferences' && key !== 'lastModifiedTime') {
        return userRecord[key] === undefined
      } else {
        return false
      }
    })
    this.loadingUserRecord = !!missingValues.length
  }
}
