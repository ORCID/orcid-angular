import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TrustedSummaryService } from 'src/app/core/trusted-summary/trusted-summary.service'
import { TrustedSummary } from 'src/app/types/trust-summary'
import { SimpleActivityModel } from '../summary-simple-panel/summary-simple-panel.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { RobotsMetaTagsService } from 'src/app/core/robots-meta-tags/robots-meta-tags.service'
import { ZendeskService } from 'src/app/core/zendesk/zendesk.service'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-trusted-summary',
  templateUrl: './trusted-summary.component.html',
  styleUrls: [
    './trusted-summary.component.scss',
    './trusted-summary.component.scss-theme.scss',
  ],
})
export class TrustedSummaryComponent implements OnInit, OnDestroy {
  @Input() standaloneMode: boolean = true
  trustedSummary: TrustedSummary
  currentLocation: string
  orcid: string
  works: SimpleActivityModel[] = []
  unsubscribe = new Subject()
  affiliationsHover = false
  worksHover = false
  peerReviewsHover = false
  fundsHover = false
  externalIdentifiersHover = false
  professionalActivitiesHover = false

  labelValidatedWorks = $localize`:@@summary.validatedWorks:Validated works`
  labelValidatedWork = $localize`:@@summary.validatedWork:Validated work`
  labelSelfAssertedWorks = $localize`:@@summary.selfAssertedWorks:Self-asserted works`
  labelSelfAssertedWork = $localize`:@@summary.selfAssertedWork:Self-asserted work`
  labelValidatedFunding = $localize`:@@summary.validatedFunding:Validated funding`
  labelValidatedFundings = $localize`:@@summary.validatedFundings:Validated fundings`
  labelSelfAssertedFunding = $localize`:@@summary.selfAssertedFunding:Self-asserted funding`
  labelSelfAssertedFundings = $localize`:@@summary.selfAssertedFundings:Self-asserted fundings`
  labelReviesFor = $localize`:@@summary.reviewsFor:reviews for`
  labelReviewFor = $localize`:@@summary.reviewFor:review for`
  labelpublicationgrants = $localize`:@@summary.publicationgrantes:publications/grants`
  labelpublicationgrant = $localize`:@@summary.publicationgrant:publication/grant`
  labelMoreAffiliations = $localize`:@@summary.moreAffiliations:more Affiliations`
  labelMoreProfessionalActivities = $localize`:@@summary.moreProfessionalActivities:more Professional activities`
  labelMoreOtherIdentifiers = $localize`:@@summary.moreOtherIdentifiers:more Other Identifiers`
  insideIframe: boolean
  labelMoreAffiliation = $localize`:@@summary.moreAffiliation:more Affiliation`
  labelMoreProfessionalActivitie = $localize`:@@summary.moreProfessionalActivitie:more Professional activity`
  labelMoreOtherIdentifier = $localize`:@@summary.moreOtherIdentifier:more Other Identifier`

  funds: SimpleActivityModel[] = []
  peerReviews: SimpleActivityModel[] = []
  mobile: boolean
  externalIdentifiers: SimpleActivityModel[]
  twoColumns: boolean = false
  threeColumns: boolean = false
  oneColumn: boolean
  createdToday = false
  modifiedToday: boolean
  creationDateWithOffset: any
  lastUpdateDate: any

  constructor(
    private _trustedSummary: TrustedSummaryService,
    private _router: Router,
    private _platform: PlatformInfoService,
    private _robotsMetaTags: RobotsMetaTagsService,
    private _zendeskService: ZendeskService,
    // import window
    @Inject(WINDOW) private _window: Window
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
    this._robotsMetaTags.restoreEnvironmentRobotsConfig()
  }

  ngOnInit(): void {
    this.insideIframe = this._window.self !== this._window.top
    this._zendeskService.hide()
    this._robotsMetaTags.disallowRobots()
    this._platform
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((platform) => {
        if (platform.columns4 || platform.columns8) {
          this.mobile = true
        } else {
          this.mobile = false
        }
      })
    this.currentLocation = window.location.origin
    this.orcid = this._router.url.split('/')[1]

    this._trustedSummary.getSummary(this.orcid).subscribe((data) => {
      this.trustedSummary = data
      if (this.trustedSummary.creation) {
        this.creationDateWithOffset = this.dateWithOffset(
          this.trustedSummary.creation
        )
        // if record was created today
        if (
          this.creationDateWithOffset.toDateString() ===
          new Date().toDateString()
        ) {
          this.createdToday = true
        }
      }
      if (this.trustedSummary.lastModified) {
        this.lastUpdateDate = this.dateWithOffset(
          this.trustedSummary.lastModified
        )
        // if record was modified today
        if (this.lastUpdateDate.toDateString() === new Date().toDateString()) {
          this.modifiedToday = true
        }
      }

      if (this.trustedSummary.validatedWorks) {
        this.works.push({
          verified: true,
          countA: this.trustedSummary.validatedWorks,
          stringA:
            this.trustedSummary.validatedWorks > 1
              ? this.labelValidatedWorks
              : this.labelValidatedWork,
        })
      }
      if (this.trustedSummary.selfAssertedWorks) {
        this.works.push({
          verified: false,
          countA: this.trustedSummary.selfAssertedWorks,
          stringA:
            this.trustedSummary.selfAssertedWorks > 1
              ? this.labelSelfAssertedWorks
              : this.labelSelfAssertedWork,
        })
      }
      if (this.trustedSummary.validatedFunds) {
        this.funds.push({
          verified: true,
          countA: this.trustedSummary.validatedFunds,
          stringA:
            this.trustedSummary.validatedFunds > 1
              ? this.labelValidatedFundings
              : this.labelValidatedFunding,
        })
      }
      if (this.trustedSummary.selfAssertedFunds) {
        this.funds.push({
          verified: false,
          countA: this.trustedSummary.selfAssertedFunds,
          stringA:
            this.trustedSummary.selfAssertedFunds > 1
              ? this.labelSelfAssertedFundings
              : this.labelSelfAssertedFunding,
        })
      }
      if (
        this.trustedSummary.peerReviewsTotal &&
        this.trustedSummary.peerReviewPublicationGrants
      ) {
        this.peerReviews.push({
          verified: true,
          countA: this.trustedSummary.peerReviewsTotal,
          stringA:
            this.trustedSummary.peerReviewsTotal > 1
              ? this.labelReviesFor
              : this.labelReviewFor,
          countB: this.trustedSummary.peerReviewPublicationGrants,
          stringB:
            this.trustedSummary.peerReviewPublicationGrants > 1
              ? this.labelpublicationgrants
              : this.labelpublicationgrant,
        })
      }
      this.externalIdentifiers = this.trustedSummary.externalIdentifiers?.map(
        (id) => {
          return {
            verified: id.validated,
            url: id.url,
            stringA: id.commonName + ': ' + id.reference,
          }
        }
      )

      if (
        (this.works.length > 0 ||
          this.funds.length > 0 ||
          this.peerReviews.length > 0) &&
        (this.externalIdentifiers?.length > 0 ||
          this.trustedSummary.professionalActivitiesCount > 0 ||
          this.trustedSummary.externalIdentifiers.length > 0)
      ) {
        this.threeColumns = true
      } else if (
        this.works.length > 0 ||
        this.funds.length > 0 ||
        this.peerReviews.length > 0 ||
        this.externalIdentifiers?.length > 0 ||
        this.trustedSummary.professionalActivitiesCount > 0
      ) {
        this.twoColumns = true
      } else {
        this.oneColumn = true
      }
    })
  }
  dateWithOffset(creation: string): any {
    const date = new Date(creation)
    const offset = date.getTimezoneOffset()
    const offsettedDate = new Date(date.getTime() + offset * 60 * 1000)
    return offsettedDate
  }
  goToActivitySection(activitySection: string) {
    this.standaloneMode
      ? this.navigateTo(activitySection)
      : this.scrollTo(activitySection)
  }
  scrollTo(activitySection: string) {
    document.querySelector(`#${activitySection}`).scrollIntoView()
  }
  navigateTo(activitySection: string) {
    this._window.open(
      `${this.trustedSummary.orcid}#${activitySection}`,
      '_blank'
    )
  }
}
