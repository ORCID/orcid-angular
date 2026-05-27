import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { Router } from '@angular/router'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { HeaderCompactService } from 'src/app/core/header-compact/header-compact.service'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { UserInfo } from 'src/app/types'
import { RecordEditButtonComponent } from '../record-edit-button/record-edit-button.component'
import { UserRecord } from 'src/app/types/record.local'
import { HeaderBannerComponent, AccentButtonDirective } from '@orcid/ui'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatButtonModule } from '@angular/material/button'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { AppEventName } from 'src/app/rum/app-event-names'
import { getFeaturedEmploymentCaption } from './featured-employment-caption.util'

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
export class RecordHeaderComponent implements OnInit, OnDestroy {
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
  userRecord: UserRecord | null
  userInfo: UserInfo | null
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

  get noDisplayableData(): boolean {
    return (
      this.affiliations === 0 &&
      !this.displaySideBar &&
      !this.displayBiography &&
      !this.userInfo?.RECORD_WITH_ISSUES
    )
  }

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
    private _state: RecordHeaderStateService,
    private _compact: HeaderCompactService,
    private _togglz: TogglzService,
    private _router: Router,
    private _rumEvents: RumJourneyEventService
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
          this.refreshCaptionFromRecord()
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
    this._state.loadingRecordHeader$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this.loadingUserRecord = !!v))
    this._state.affiliations$.pipe(takeUntil(this.$destroy)).subscribe((v) => {
      this.affiliations = v
      this.refreshHeaderFromRecord()
    })
    this._state.displaySideBar$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => {
        this.displaySideBar = !!v
        this.refreshHeaderFromRecord()
      })
    this._state.displayBiography$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => {
        this.displayBiography = !!v
        this.refreshHeaderFromRecord()
      })
    this._state.recordSummaryOpen$
      .pipe(takeUntil(this.$destroy))
      .subscribe((v) => (this._recordSummaryOpen = !!v))

    this._state.userRecord$
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => this.refreshHeaderFromRecord(userRecord))

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
        this.refreshHeaderFromRecord()
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

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.complete()
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
    this._rumEvents.recordSimpleEvent(AppEventName.RecordSummaryToggleClicked, {
      expanded: next,
    })
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

  private refreshHeaderFromRecord(
    userRecord: UserRecord | null = this.userRecord
  ) {
    this.userRecord = userRecord
    this.userInfo = userRecord?.userInfo
    this.resetNameFields()

    if (!userRecord) {
      this._state.setHasCreditOrOtherNames(false)
      this.refreshCaptionFromRecord()
      return
    }

    if (!!this.userInfo?.PRIMARY_RECORD) {
      // Deprecated records must not expose any primary names in the header.
      this.bannerTitle = ''
      this.bannerSubtitle = ''
    } else {
      if (!isEmpty(this.userRecord?.names)) {
        this.givenNames = RecordUtil.getGivenNames(userRecord)
        this.familyName = RecordUtil.getFamilyName(userRecord)
        this.creditName = RecordUtil.getCreditName(userRecord)
        this.ariaLabelName = RecordUtil.getAriaLabelName(
          userRecord,
          this.ariaLabelName
        )
      } else {
        const hasAnyOtherPublicInfo =
          this.affiliations > 0 || this.displaySideBar || this.displayBiography

        if (
          hasAnyOtherPublicInfo ||
          (!hasAnyOtherPublicInfo && !this.userInfo?.RECORD_WITH_ISSUES)
        ) {
          this.creditName = this.privateName
        }
      }

      let fullName = this.givenNames
      if (!isEmpty(this.familyName)) {
        fullName += ` ${this.familyName}`
      }

      if (!isEmpty(userRecord.otherNames?.otherNames)) {
        this.otherNames = RecordUtil.getOtherNamesUnique(
          userRecord.otherNames?.otherNames
        )

        if (!isEmpty(this.creditName) && !isEmpty(fullName)) {
          this.otherNames = `${fullName}; ${this.otherNames}`
        }
      } else if (!isEmpty(this.creditName) && !isEmpty(fullName)) {
        this.otherNames = `${fullName}`
      }

      this.bannerTitle = this.creditName || fullName || ''
      this.bannerSubtitle = this.otherNames || ''
    }

    const hasCreditName = !!this.userRecord?.names?.creditName?.value
    const hasOtherNames = !isEmpty(this.userRecord?.otherNames?.otherNames)
    this._state.setHasCreditOrOtherNames(hasCreditName || hasOtherNames)
    this.refreshCaptionFromRecord(userRecord)
  }

  private resetNameFields(): void {
    this.givenNames = ''
    this.familyName = ''
    this.creditName = ''
    this.otherNames = ''
    this.ariaLabelName = ''
    this.bannerTitle = ''
    this.bannerSubtitle = ''
  }

  private refreshCaptionFromRecord(
    userRecord: UserRecord | null = this.userRecord
  ): void {
    if (!this.bannerCaptionEnabled) {
      this.bannerCaption = ''
      return
    }
    this.bannerCaption = getFeaturedEmploymentCaption(userRecord?.affiliations)
  }
}
