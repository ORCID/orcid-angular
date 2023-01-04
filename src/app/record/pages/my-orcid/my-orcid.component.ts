import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { ORCID_REGEXP } from 'src/app/constants'
import { first, switchMap, takeUntil, tap } from 'rxjs/operators'
import { RecordService } from '../../../core/record/record.service'
import { Subject } from 'rxjs'
import { MainPanelsState, UserRecord } from '../../../types/record.local'
import { OpenGraphService } from 'src/app/core/open-graph/open-graph.service'
import { RobotsMetaTagsService } from 'src/app/core/robots-meta-tags/robots-meta-tags.service'
import { UserInfoService } from '../../../core/user-info/user-info.service'
import { UserInfo } from '../../../types'
import { UserService } from 'src/app/core'
import { WINDOW } from 'src/app/cdk/window'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { HelpHeroService } from 'src/app/core/help-hero/help-hero.service'
import { ScriptService } from '../../../core/crazy-egg/script.service'

@Component({
  selector: 'app-my-orcid',
  templateUrl: './my-orcid.component.html',
  styleUrls: [
    './my-orcid.component.scss',
    './my-orcid.component.scss-theme.scss',
  ],
})
export class MyOrcidComponent implements OnInit, OnDestroy {
  private readonly $destroy = new Subject()

  platform: PlatformInfo
  publicOrcid: string
  affiliations: number
  userInfo: UserInfo
  userRecord: UserRecord
  collapseAllActivitiesArialLabel = $localize`:@@shared.collapseAllActivitiesArialLabel:Collapse all activity sections`
  expandAllActivitiesArialLabel = $localize`:@@shared.expandAllActivitiesArialLabel:Expand all activity sections`

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
  initMyOrcidParameter = false

  regionActivities = $localize`:@@shared.activities:Activities`

  constructor(
    _userInfoService: UserInfoService,
    private _platform: PlatformInfoService,
    private route: ActivatedRoute,
    private _record: RecordService,
    private _openGraph: OpenGraphService,
    private _robotsMeta: RobotsMetaTagsService,
    private _helpHeroService: HelpHeroService,
    private _router: Router,
    private _userSession: UserService,
    @Inject(WINDOW) private window: Window,
    private _togglz: TogglzService,
    private _scriptService: ScriptService
  ) {}

  private checkIfThisIsAPublicOrcid() {
    if (this.getRouteOrcidID()) {
      return (this.publicOrcid = this.getRouteOrcidID())
    }
    return undefined
  }

  private getRouteOrcidID(): string {
    if (this.route.parent?.snapshot.url) {
      const firstUrlSegment = this.route.parent.snapshot.url[0]
      if (
        firstUrlSegment &&
        firstUrlSegment.toString() &&
        ORCID_REGEXP.test(firstUrlSegment.toString())
      ) {
        return firstUrlSegment.toString()
      }
    }
  }

  ngOnInit(): void {
    this.checkIfThisIsAPublicOrcid()
    this.affiliations = 0
    this._platform.get().subscribe((value) => (this.platform = value))
    this._record
      .getRecord({
        publicRecordId: this.publicOrcid || undefined,
        forceReload: true,
        /// TODO
        // cleaning the cache is only require when the user login or register *** (To make sure not previous session is displayed)
        // This means that we can later figure out a way  to NOT CLEAN cache when the user is navigating between the app router features.
        // In that way we KEEP THE forceReload (meaning that any update is loaded as done right now)
        // but also the cache is used to pain the my-orcid page super fast (With cache data)
        //
        // This could be archive using a local-storage parameter or a query parameter,
        // to know if the user just login or registered and the cache must be clean.
        //
        // at the moment the cache will always bee cleaned,
        // as a quick solution to not show cache data when a user logouts/login with different accounts.
        cleanCacheIfExist: true,
      })
      .pipe(
        takeUntil(this.$destroy),
        tap((userRecord) => {
          this.userInfo = userRecord?.userInfo
          this.checkLoadingState(userRecord)
          this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
          this.userNotFound = userRecord?.userInfo?.USER_NOT_FOUND
          this.userRecord = userRecord

          if (!this.publicOrcid && userRecord?.userInfo) {
            this.setMyOrcidIdQueryParameter()
            this.observeSessionUpdates()
          }

          if (
            this.publicOrcid &&
            (this.recordWithIssues || this.userNotFound)
          ) {
            this._robotsMeta.disallowRobots()
          }
          this._openGraph.addOpenGraphData(userRecord, { force: true })
        }),
        switchMap(() => this._togglz.getTogglz().pipe(first())),
        tap((togglz) => {
          if (togglz.messages['ORCID_ANGULAR_HELP_HERO'] === 'true') {
            if (
              !this.publicOrcid &&
              !(this.recordWithIssues || this.userNotFound)
            ) {
              this._helpHeroService.initializeHelpHero(
                this.userInfo,
                this.userRecord
              )
            }
          }

          if (togglz.messages['CRAZY_EGG'] === 'true') {
            this._scriptService
              .load({
                name: 'crazy-egg',
                src: 'https://script.crazyegg.com/pages/scripts/0113/7579.js',
              })
              .subscribe()
          }
        })
      )
      .subscribe()
  }

  private observeSessionUpdates() {
    this._userSession
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        if (
          value?.userInfo?.REAL_USER_ORCID !== this.userInfo.REAL_USER_ORCID ||
          value?.userInfo?.EFFECTIVE_USER_ORCID !==
            this.userInfo.EFFECTIVE_USER_ORCID
        ) {
          this.window.location.reload()
        }
      })
  }

  private setMyOrcidIdQueryParameter() {
    if (this.userInfo?.EFFECTIVE_USER_ORCID && !this.initMyOrcidParameter) {
      this.initMyOrcidParameter = true

      if (!this.platform.queryParameters.hasOwnProperty('justRegistered')) {
        this._router.navigate(['/my-orcid'], {
          queryParams: { orcid: this.userInfo.EFFECTIVE_USER_ORCID },
        })
      } else {
        this._router.navigate(['/my-orcid'], {
          queryParams: {
            orcid: this.userInfo.EFFECTIVE_USER_ORCID,
            justRegistered: 'true',
          },
        })
      }
    }
  }

  ngOnDestroy(): void {
    if (this.publicOrcid) {
      this._robotsMeta.restoreEnvironmentRobotsConfig()
    }
    this._openGraph.removeOpenGraphData()
    this.$destroy.next(true)
    this.$destroy.complete()
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
    this.affiliations = this.affiliations + itemsCount
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
