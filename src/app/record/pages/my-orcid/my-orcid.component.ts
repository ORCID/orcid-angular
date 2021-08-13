import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { ORCID_REGEXP } from 'src/app/constants'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from '../../../core/record/record.service'
import { Subject } from 'rxjs'
import { UserRecord } from '../../../types/record.local'
import { OpenGraphService } from 'src/app/core/open-graph/open-graph.service'
import { RobotsMetaTagsService } from 'src/app/core/robots-meta-tags/robots-meta-tags.service'

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
  userRecord: UserRecord
  expandedContent = true
  expandedButton = true
  expandedAffiliations: boolean
  expandedFundings: boolean
  expandedWorks: boolean
  expandedResearchResources: boolean
  expandedPeerReview: boolean
  recordWithIssues: boolean
  loading = false

  constructor(
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
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        this.userRecord = userRecord
        this.loading = true
        if (this.publicOrcid && this.recordWithIssues) {
          this._robotsMeta.addRobotMetaTags()
        }
      })

    if (this.publicOrcid) {
      this._openGraph.addOpenGraphData(this.publicOrcid)
    }
  }

  ngOnDestroy(): void {
    if (this.publicOrcid) {
      this._openGraph.removeOpenGraphData()
      this._robotsMeta.removeRobotMetaTags()
    }
  }

  collapse() {
    this.expandedContent = !this.expandedContent
  }

  affiliationsCount(itemsCount: Event) {
    this.affiliations = this.affiliations + +itemsCount
  }

  expandedByType(event) {
    switch (event.type) {
      case 'affiliations':
        this.expandedAffiliations = event.expanded
        break
      case 'fundings':
        this.expandedFundings = event.expanded
        break
      case 'works':
        this.expandedWorks = event.expanded
        break
      case 'research-resources':
        this.expandedResearchResources = event.expanded
        break
      case 'peer-review':
        this.expandedPeerReview = event.expanded
        break
    }

    if (
      this.expandedAffiliations !== undefined &&
      this.expandedFundings !== undefined &&
      this.expandedWorks !== undefined &&
      this.expandedResearchResources !== undefined &&
      this.expandedPeerReview !== undefined
    ) {
      if (
        (this.expandedAffiliations &&
          this.expandedFundings &&
          this.expandedWorks &&
          this.expandedPeerReview) ||
        (!this.expandedAffiliations &&
          !this.expandedFundings &&
          !this.expandedWorks &&
          !this.expandedResearchResources &&
          !this.expandedPeerReview)
      ) {
        this.collapse()
      }
    }
  }
}
