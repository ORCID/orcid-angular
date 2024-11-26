import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { ORCID_REGEXP } from 'src/app/constants'
import {
  first,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators'
import { RecordService } from '../../../core/record/record.service'
import { EMPTY, of, Subject } from 'rxjs'
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
import { DOCUMENT, Location } from '@angular/common'
import { environment } from 'src/environments/environment'
import { filter, map } from 'rxjs/operators'
import { CanonocalUrlService } from 'src/app/core/canonocal-url/canonocal-url.service'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { LoginInterstitialsService } from 'src/app/core/login-interstitials/login-interstitials.service'

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
  recordSummaryOpen = false

  platform: PlatformInfo
  publicOrcid: string
  affiliations: number
  displaySideBar: boolean
  displayBiography: boolean
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
    PROFESSIONAL_ACTIVITIES: true,
  }

  researchResourcePresent: boolean

  expandedButton = true

  recordWithIssues: boolean
  userNotFound: boolean
  loadingUserRecord: boolean
  globalExpandState = true
  initMyOrcidParameter = false

  regionActivities = $localize`:@@shared.activities:Activities`
  readyForIndexing: boolean
  fragment: string
  newlySharedDomains: string[]= ['test']

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
    private _scriptService: ScriptService,
    private _canonocalUrlService: CanonocalUrlService,
    private location: Location,
    private _loginInterstitialsService: LoginInterstitialsService
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

    if (this.publicOrcid) {
      this._canonocalUrlService.setCanonicalUrl(this.publicOrcid)
    }

    // Remove fragment temporally, to adding back when items have loaded
    this.route.fragment.pipe(take(1)).subscribe((fragment) => {
      if (fragment) {
        this.fragment = fragment
        this._router.navigate([], { fragment: '' })
      }
    })

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

          if (userRecord?.userInfo) {
            this.readyForIndexing =
              userRecord?.userInfo?.READY_FOR_INDEXING === 'true'
            if (this.publicOrcid && !this.readyForIndexing) {
              this._robotsMeta.disallowRobots()
            }
          }

          this.userNotFound = userRecord?.userInfo?.USER_NOT_FOUND
          this.userRecord = userRecord

          if (!this.publicOrcid && userRecord?.userInfo) {
            this.setMyOrcidIdQueryParameter()
            this.observeSessionUpdates()
          }

          this._openGraph.addOpenGraphData(userRecord, { force: true })

          // Add back fragment  when items have loaded
          if (
            userRecord.works &&
            userRecord.fundings &&
            userRecord.peerReviews &&
            userRecord.researchResources &&
            userRecord.affiliations &&
            userRecord.externalIdentifier &&
            [
              'works',
              'affiliations',
              'peer-reviews',
              'funding',
              'professional-activities',
              'research-resources',
              'emails-panel',
              'education-and-qualification',
            ].find((x) => x === this.fragment)
          ) {
            setTimeout(() => {
              document.querySelector('#' + this.fragment).scrollIntoView()
              this._router.navigate([], { fragment: this.fragment })
            })
          }
          if (
            userRecord.externalIdentifier &&
            this.fragment === 'other-identifiers'
          ) {
            setTimeout(() => {
              document.querySelector('#' + this.fragment).scrollIntoView()
              this._router.navigate([], { fragment: this.fragment })
            })
          }

          this.displaySideBar = RecordUtil.isSideBarEmpty(
            !!this.publicOrcid,
            userRecord
          )
          this.displayBiography = !!userRecord?.biography
        }),
        mergeMap((userRecord) => {
          const interstitialDialog =
            this._loginInterstitialsService.checkLoginInterstitials(userRecord)
          if (interstitialDialog) {
            return interstitialDialog.pipe(
              tap((newlySharedDomains) => {
                this.newlySharedDomains = newlySharedDomains
              })
            )
          } else {
            return EMPTY
          }
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

      this.route.queryParams.subscribe((params) => {
        let url = null
        if (!params['justRegistered']) {
          url = this._router
            .createUrlTree([], {
              relativeTo: this.route,
              queryParams: {
                ...this.platform.queryParameters,
                orcid: this.userInfo.EFFECTIVE_USER_ORCID,
              },
            })
            .toString()
        } else {
          url = this._router.createUrlTree([], {
            relativeTo: this.route,
            queryParams: {
              orcid: this.userInfo.EFFECTIVE_USER_ORCID,
              justRegistered: 'true',
            },
          })
        }
        this.location.go(url)
      })
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

  isSideBarEmpty(displaySideBar: boolean) {
    this.displaySideBar = displaySideBar
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
