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
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { concat } from 'lodash'

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
  researchResorucesHover = false
  externalIdentifiersHover = false
  professionalActivitiesHover = false
  educationQualificationsHover = false
  emailDomainsHover = false

  insideIframe: boolean
  ariaLabelAffiliations: string
  ariaLabelWorks: string
  ariaLabelFundings: string
  ariaLabelPeerReviews: string
  ariaLabelProfessionalActivities: string
  ariaLabelEducationQualificationsActions: string
  ariaLabelResearchResources: string
  ariaLabelIdentifiers: string
  ariaLabelEmailDomains: string

  labelValidatedWorks = $localize`:@@summary.validatedWorks:Validated works`
  labelValidatedWork = $localize`:@@summary.validatedWork:Validated work`
  labelSelfAssertedWorks = $localize`:@@summary.selfAssertedWorks:Self-asserted works`
  labelSelfAssertedWork = $localize`:@@summary.selfAssertedWork:Self-asserted work`
  labelValidatedFunding = $localize`:@@summary.validatedFunding:Validated funding`
  labelValidatedFundings = $localize`:@@summary.validatedFundings:Validated fundings`
  labelSelfAssertedFunding = $localize`:@@summary.selfAssertedFunding:Self-asserted funding`
  labelSelfAssertedFundings = $localize`:@@summary.selfAssertedFundings:Self-asserted fundings`
  labelSelfAssertedResearchResources = $localize`:@@summary.selfAssertedResearchResources:Self-asserted research resources`
  labelValidatedResearchResources = $localize`:@@summary.validatedResearchResources:Validated research resources`
  labelSelfAssertedResearchResource = $localize`:@@summary.selfAssertedResearchResource:Self-asserted research resource`
  labelValidatedResearchResource = $localize`:@@summary.validatedResearchResource:Validated research resource`
  labelReviesFor = $localize`:@@summary.reviewsFor:reviews for`
  labelReviewFor = $localize`:@@summary.reviewFor:review for`
  labelpublicationgrants = $localize`:@@summary.publicationgrantes:publications/grants`
  labelpublicationgrant = $localize`:@@summary.publicationgrant:publication/grant`
  labelMoreAffiliations = $localize`:@@summary.moreAffiliations:more Affiliations`
  labelMoreProfessionalActivities = $localize`:@@summary.moreProfessionalActivities:more Professional activities`
  labelMoreOtherIdentifiers = $localize`:@@summary.moreOtherIdentifiers:more Other Identifiers`
  labelMoreEmailDomains = $localize`:@@summary.moreEmailDomains:more Email Domains`
  labelMoreEmailDomain = $localize`:@@summary.moreEmailDomain:more Email Domain`
  labelMoreAffiliation = $localize`:@@summary.moreAffiliation:more Affiliation`
  labelMoreProfessionalActivitie = $localize`:@@summary.moreProfessionalActivitie:more Professional activity`
  labelMoreOtherIdentifier = $localize`:@@summary.moreOtherIdentifier:more Other Identifier`
  labelEmailDomains = $localize`:@@summary.emailDomainsLabel:Email Domains`
  labelOrcidRecord = $localize`:@@public-layout.my_orcid:ORCID Record`
  labelViewAffiliations = $localize`:@@summary.viewAffiliations:View all affiliations in`
  labelViewWorks = $localize`:@@summary.viewWorks:View all works in`
  labelViewFundings = $localize`:@@summary.viewFundings:View all funding in`
  labelViewResearchResources = $localize`:@@summary.viewResearchResources:View all research and resources in`
  labelViewPeerReviews = $localize`:@@summary.viewPeerReviews:View all peer reviews in`
  labelViewProfessionalActivities = $localize`:@@summary.viewProfessionalActivities:View all professional activities in`
  labelViewIdentifiers = $localize`:@@summary.viewIdentifiers:View all identifiers in`
  labelViewEducationQualificationsActivities = $localize`:@@summary.viewEducationQualificationsActivities:More education qualification activities`
  labelViewEducationQualificationsActivitie = $localize`:@@summary.viewEducationQualificationsActivitie:More education qualification activity`
  labelViewDomain = $localize`:@@summary.viewDomain:View all email domains in`

  funds: SimpleActivityModel[] = []
  researchResoruces: SimpleActivityModel[] = []
  peerReviews: SimpleActivityModel[] = []
  mobile: boolean
  externalIdentifiers: SimpleActivityModel[]
  emailDomains: SimpleActivityModel[]
  twoColumns: boolean = false
  threeColumns: boolean = false
  oneColumn: boolean
  createdToday = false
  modifiedToday: boolean
  creationDateWithOffset: any
  lastUpdateDate: any
  loading = true

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
    this.orcid = this._router.url.split('/')[1].split('?')[0]

    this._trustedSummary.getSummary(this.orcid).subscribe((data) => {
      this.trustedSummary = data
      this.loading = false

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

      if (this.trustedSummary.validatedResearchResources) {
        this.researchResoruces.push({
          verified: true,
          countA: this.trustedSummary.validatedResearchResources,
          stringA:
            this.trustedSummary.validatedResearchResources > 1
              ? this.labelValidatedResearchResources
              : this.labelValidatedResearchResource,
        })
      }
      if (this.trustedSummary.selfAssertedResearchResources) {
        this.researchResoruces.push({
          verified: false,
          countA: this.trustedSummary.selfAssertedResearchResources,
          stringA:
            this.trustedSummary.selfAssertedResearchResources > 1
              ? this.labelSelfAssertedResearchResources
              : this.labelSelfAssertedResearchResource,
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
      this.emailDomains = this.trustedSummary.emailDomains?.map((domain) => {
        return {
          verified: true,
          stringA: domain.value,
        }
      })

      if (
        (this.works.length > 0 ||
          this.funds.length > 0 ||
          this.peerReviews.length > 0) &&
        (this.externalIdentifiers?.length > 0 ||
          this.trustedSummary.professionalActivitiesCount > 0 ||
          this.trustedSummary.externalIdentifiers.length > 0 ||
          this.trustedSummary.externalIdentifiers.length > 0 ||
          this.researchResoruces.length > 0)
      ) {
        this.threeColumns = true
      } else if (
        this.works.length > 0 ||
        this.funds.length > 0 ||
        this.peerReviews.length > 0 ||
        this.externalIdentifiers?.length > 0 ||
        this.trustedSummary.professionalActivitiesCount > 0 ||
        this.researchResoruces.length > 0
      ) {
        this.twoColumns = true
      } else {
        this.oneColumn = true
      }
      this.ariaLabelAffiliations = this.getAriaLabelSection(
        this.labelViewAffiliations
      )
      this.ariaLabelWorks = this.getAriaLabelSection(this.labelViewWorks)
      this.ariaLabelFundings = this.getAriaLabelSection(this.labelViewFundings)
      this.ariaLabelResearchResources = this.getAriaLabelSection(
        this.labelViewResearchResources
      )
      this.ariaLabelPeerReviews = this.getAriaLabelSection(
        this.labelViewPeerReviews
      )
      this.ariaLabelProfessionalActivities = this.getAriaLabelSection(
        this.labelViewProfessionalActivities
      )

      this.ariaLabelEducationQualificationsActions = this.getAriaLabelSection(
        this.labelViewEducationQualificationsActivities
      )

      this.ariaLabelIdentifiers = this.getAriaLabelSection(
        this.labelViewIdentifiers
      )

      this.ariaLabelEmailDomains = this.getAriaLabelSection(
        this.labelViewDomain
      )
    })
  }
  dateWithOffset(creation: string): any {
    const date = new Date(creation)
    const offset = date.getTimezoneOffset()
    const offsettedDate = new Date(date.getTime() + offset * 60 * 1000)
    return offsettedDate
  }
  goToActivitySection(activitySection: string, event?: KeyboardEvent) {
    this.standaloneMode
      ? this.navigateTo(activitySection, event)
      : RecordUtil.scrollTo(activitySection, event)
  }
  navigateTo(activitySection: string, event?: KeyboardEvent) {
    if (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        this._window.open(
          `${this.trustedSummary.orcid}#${activitySection}`,
          '_blank'
        )
      }
    } else {
      this._window.open(
        `${this.trustedSummary.orcid}#${activitySection}`,
        '_blank'
      )
    }
  }

  private getAriaLabelSection(section: string): string {
    const ariaLabel = `${section} ${this.trustedSummary.name} ${this.labelOrcidRecord}`
    if (this.standaloneMode) {
      return RecordUtil.appendOpensInNewTab(ariaLabel)
    }
    return ariaLabel
  }
}
