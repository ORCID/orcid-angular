import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { Router } from '@angular/router'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { HeaderCompactService } from 'src/app/core/header-compact/header-compact.service'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil, switchMap } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { Assertion, UserInfo } from 'src/app/types'
import { RecordEditButtonComponent } from '../record-edit-button/record-edit-button.component'
import { UserRecord } from 'src/app/types/record.local'
import { HeaderBannerComponent, AccentButtonDirective } from '@orcid/ui'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatButtonModule } from '@angular/material/button'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import {
  AffiliationUIGroup,
  Affiliation,
} from 'src/app/types/record-affiliation.endpoint'

@Component({
  selector: 'app-record-header',
  templateUrl: './record-header.component.html',
  styleUrls: [
    './record-header.component.scss',
    './record-header.component.scss-theme.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RecordEditButtonComponent,
    HeaderBannerComponent,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    AccentButtonDirective,
  ],
})
export class RecordHeaderComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()
  loadingUserRecord = true
  isPublicRecord: string
  affiliations: number
  displaySideBar: boolean
  displayBiography: boolean
  compactMode = false
  @Input() disableCompactMode = false
  _recordSummaryOpen: boolean

  get recordSummaryOpen(): boolean {
    return this._recordSummaryOpen
  }
  @Output() recordSummaryOpenChange = new EventEmitter<boolean>()

  platform: PlatformInfo
  recordWithIssues: boolean
  userRecord: UserRecord
  userInfo: UserInfo
  environment = runtimeEnvironment
  givenNames = ''
  familyName = ''
  creditName = ''
  otherNames = ''
  ariaLabelName = ''
  orcidId = ''
  headerCompactEnabled = false

  // Generic banner view-model properties used by the UI layer
  bannerTitle = ''
  bannerSubtitle = ''
  bannerCaption = ''
  bannerPrimaryIdText = ''
  bannerSecondaryIdText = ''
  bannerCaptionEnabled = false

  // Main action button properties
  mainActionName = ''
  private isLoggedIn = false
  private loggedUserOrcid: string | undefined

  // Issue banner property
  get issueTitle(): string {
    if (!this.userInfo?.RECORD_WITH_ISSUES) {
      return ''
    }
    if (
      this.userInfo?.IS_DEACTIVATED === 'true' &&
      !this.userInfo?.PRIMARY_RECORD
    ) {
      return this.deactivatedMessage
    }
    if (
      this.userInfo?.IS_LOCKED === 'true' &&
      this.userInfo?.IS_DEACTIVATED === 'false' &&
      !this.userInfo?.PRIMARY_RECORD
    ) {
      return this.lockedMessage
    }
    if (!!this.userInfo?.PRIMARY_RECORD) {
      return this.deprecatedMessage
    }
    return ''
  }

  regionNames = $localize`:@@topBar.names:Names`
  regionOrcidId = 'Orcid iD'
  tooltipPrintableVersion = $localize`:@@topBar.printableRecord:Printable record`
  tooltipCopy = $localize`:@@topBar.copyId:Copy iD`
  privateName = $localize`:@@account.nameIsPri:Name is private`

  deactivatedMessage = $localize`:@@summary.recordIsDeactivated:This record has been deactivated`
  lockedMessage = $localize`:@@summary.recordIsLocked:This record is locked`
  deprecatedMessage = $localize`:@@summary.recordIsDeprecated:This record has been deprecated`
  hideSummaryLabel = $localize`:@@summary.hideRecordSummary:Hide record summary`
  showSummaryLabel = $localize`:@@summary.showRecordSummary:Show record summary`

  ariaLabelCopyOrcidId = $localize`:@@topBar.ariaLabelCopyOrcidId:Copy your ORCID iD to the clipboard`
  ariaLabelViewPrintable = $localize`:@@topBar.ariaLabelViewPrintable:View a printable version of your ORCID record (Opens in new tab)`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _state: RecordHeaderStateService,
    private _compact: HeaderCompactService,
    private _togglz: TogglzService,
    private _router: Router,
    private _affiliations: RecordAffiliationService
  ) {}

  ngOnInit(): void {
    // Subscribe to HEADER_COMPACT flag
    this._togglz
      .getStateOf(TogglzFlag.HEADER_COMPACT)
      .pipe(takeUntil(this.$destroy))
      .subscribe((enabled) => {
        this.headerCompactEnabled = !!enabled
        this.computeMainActionState()
      })

    this._togglz
      .getStateOf(TogglzFlag.FEATURED_AFFILIATIONS)
      .pipe(takeUntil(this.$destroy))
      .subscribe((enabled) => {
        this.bannerCaptionEnabled = !!enabled
        if (!enabled) {
          this.bannerCaption = ''
        } else {
          // Reload featured employment if flag is enabled
          this.loadFeaturedEmployment(this.isPublicRecord)
        }
      })

    // Compact state
    this._compact.compactActive$
      .pipe(takeUntil(this.$destroy))
      .subscribe((active) =>
        this.disableCompactMode
          ? (this.compactMode = false)
          : (this.compactMode = !!active)
      )

    // Subscribe to shared state for inputs
    this._state.loadingUserRecord$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this.loadingUserRecord = !!v))
    this._state.affiliations$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this.affiliations = v))
    this._state.displaySideBar$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this.displaySideBar = !!v))
    this._state.displayBiography$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this.displayBiography = !!v))
    this._state.recordSummaryOpen$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this._recordSummaryOpen = !!v))

    // When public ORCID changes, update id and load record
    this._state.isPublicRecord$
      .pipe(takeUntil(this.$destroy))
      .subscribe((publicId) => {
        this.isPublicRecord = publicId
        this.orcidId =
          'https:' + runtimeEnvironment.BASE_URL + (this.isPublicRecord || '')
        this.bannerPrimaryIdText = this.isPublicRecord || ''
        this.bannerSecondaryIdText = this.orcidId || ''
        this.computeMainActionState()
        if (this.isPublicRecord) {
          this.loadRecord(this.isPublicRecord)
        }
        // Load affiliations (for public record or current user)
        this.loadFeaturedEmployment(this.isPublicRecord)
      })

    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((session) => {
        const info = session?.userInfo
        this.isLoggedIn = !!info
        this.loggedUserOrcid = info?.EFFECTIVE_USER_ORCID
        this.computeMainActionState()
      })

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  clipboard() {
    this.window.navigator.clipboard.writeText(this.orcidId)
  }

  printRecord() {
    this.window.open(
      runtimeEnvironment.BASE_URL +
        this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID +
        '/print'
    )
  }
  recordSummaryLinkClick() {
    const next = !this.recordSummaryOpen
    this._state.setRecordSummaryOpen(next)
    this.recordSummaryOpenChange.emit(next)
  }

  private computeMainActionState() {
    if (!this.headerCompactEnabled) {
      this.mainActionName = ''
      return
    }

    const isOwner =
      !!this.isPublicRecord &&
      !!this.loggedUserOrcid &&
      this.isPublicRecord === this.loggedUserOrcid

    if (!this.isLoggedIn) {
      this.mainActionName = $localize`:@@record.editTooltipSignIn:Is this you? Sign in to start editing your ORCID record`
      return
    }
    if (isOwner) {
      this.mainActionName = $localize`:@@record.editYourOrcidRecord:Edit your ORCID record`
      return
    }
    this.mainActionName = ''
  }

  onMainActionClick() {
    if (!this.isLoggedIn) {
      this._router.navigate(['signin'])
      return
    }
    // If owner, go to my-orcid
    this._router.navigate(['my-orcid'])
  }

  private loadRecord(publicRecordId: string) {
    this._record
      .getRecord({
        publicRecordId,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.userRecord = userRecord
        this.userInfo = userRecord?.userInfo

        if (!!this.userInfo?.PRIMARY_RECORD) {
          // If this record is deprecated and has a primary record,
          // do not expose any of the primary names in the header.
          this.givenNames = ''
          this.familyName = ''
          this.creditName = ''
          this.otherNames = ''
          this.ariaLabelName = ''

          // Compose UI-only title/subtitle that the header banner consumes
          this.bannerTitle = ''
          this.bannerSubtitle = ''
        } else {
          if (!isEmpty(this.userRecord?.names)) {
            this.givenNames = RecordUtil.getGivenNames(this.userRecord)
            this.familyName = RecordUtil.getFamilyName(this.userRecord)
            this.creditName = RecordUtil.getCreditName(this.userRecord)
            this.ariaLabelName = RecordUtil.getAriaLabelName(
              this.userRecord,
              this.ariaLabelName
            )
          } else {
            const hasAnyOtherPublicInfo =
              this.affiliations > 0 ||
              this.displaySideBar ||
              this.displayBiography

            // Scenario 1: there is other public information on the record
            if (
              hasAnyOtherPublicInfo ||
              // Scenario 2: no public information is available anywhere,
              // matching the "no displayable data for this record" banner
              (!hasAnyOtherPublicInfo && !this.userInfo?.RECORD_WITH_ISSUES)
            ) {
              this.creditName = this.privateName
            }
          }

          let fullName = this.givenNames
          if (!isEmpty(this.familyName)) {
            fullName += ` ${this.familyName}`
          }

          if (!isEmpty(this.userRecord.otherNames?.otherNames)) {
            this.otherNames = RecordUtil.getOtherNamesUnique(
              userRecord.otherNames?.otherNames
            )

            if (!isEmpty(this.creditName)) {
              if (!isEmpty(fullName)) {
                this.otherNames = `${fullName}; ${this.otherNames}`
              }
            }
          } else {
            if (!isEmpty(this.creditName) && !isEmpty(fullName)) {
              this.otherNames = `${fullName}`
            }
          }

          // Compose UI-only title/subtitle that the header banner consumes
          this.bannerTitle = this.creditName || fullName || ''
          this.bannerSubtitle = this.otherNames || ''
        }

        const hasCreditName = !!this.userRecord?.names?.creditName?.value
        const hasOtherNames = !isEmpty(this.userRecord?.otherNames?.otherNames)
        this._state.setHasCreditOrOtherNames(hasCreditName || hasOtherNames)
      })
  }

  private loadFeaturedEmployment(publicRecordId?: string): void {
    if (!this.bannerCaptionEnabled) {
      this.bannerCaption = ''
      return
    }
    this._affiliations
      .getAffiliations({
        publicRecordId: publicRecordId || undefined,
        forceReload: false,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((affiliations) => {
        if (affiliations) {
          this.bannerCaption = this.formatFeaturedEmployment(affiliations)
        } else {
          this.bannerCaption = ''
        }
      })
  }

  private formatFeaturedEmployment(affiliations: AffiliationUIGroup[]): string {
    if (!affiliations || affiliations.length === 0) {
      return ''
    }

    // Find the EMPLOYMENT group
    const employmentGroup = affiliations.find(
      (group) => group.type === 'EMPLOYMENT'
    )

    if (!employmentGroup || !employmentGroup.affiliationGroup) {
      return ''
    }

    // Find featured employment in all affiliation groups
    for (const group of employmentGroup.affiliationGroup) {
      if (group.affiliations) {
        const featuredAffiliation = group.affiliations.find(
          (affiliation) =>
            affiliation.featured === true &&
            affiliation.affiliationType?.value === 'employment'
        )

        if (featuredAffiliation) {
          return this.formatAffiliationCaption(featuredAffiliation)
        }
      }
    }

    return ''
  }

  private formatAffiliationCaption(affiliation: Affiliation): string {
    const parts: string[] = []

    // Organization name
    const orgName = affiliation.affiliationName?.value
    if (orgName) {
      parts.push(orgName)
    }

    // Location: city, region, country
    const locationParts: string[] = []
    if (affiliation.city?.value) {
      locationParts.push(affiliation.city.value)
    }
    if (affiliation.region?.value) {
      locationParts.push(affiliation.region.value)
    }
    if (affiliation.countryForDisplay) {
      locationParts.push(affiliation.countryForDisplay)
    } else if (affiliation.country?.value) {
      locationParts.push(affiliation.country.value)
    }

    // Combine organization and location
    if (orgName && locationParts.length > 0) {
      parts[0] = `${orgName}: ${locationParts.join(', ')}`
    } else if (locationParts.length > 0) {
      parts.push(locationParts.join(', '))
    }

    // Role and department
    const roleParts: string[] = []
    if (affiliation.roleTitle?.value) {
      roleParts.push(affiliation.roleTitle.value)
    }
    if (affiliation.departmentName?.value) {
      roleParts.push(affiliation.departmentName.value)
    }

    if (roleParts.length > 0) {
      if (parts.length > 0) {
        parts.push(`- ${roleParts.join(', ')}`)
      } else {
        parts.push(roleParts.join(', '))
      }
    }

    return parts.join(' ')
  }
}
