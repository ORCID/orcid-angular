import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { HeaderCompactService } from 'src/app/core/header-compact/header-compact.service'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { Assertion, UserInfo } from 'src/app/types'
import { RecordEditButtonComponent } from '../record-edit-button/record-edit-button.component'
import { RecordSummaryComponent } from '../record-summary/record-summary.component'
import { UserRecord } from 'src/app/types/record.local'

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
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RecordEditButtonComponent,
    RecordSummaryComponent,
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

  regionNames = $localize`:@@topBar.names:Names`
  regionOrcidId = 'Orcid iD'
  tooltipPrintableVersion = $localize`:@@topBar.printableRecord:Printable record`
  tooltipCopy = $localize`:@@topBar.copyId:Copy iD`
  privateName = $localize`:@@account.nameIsPri:Name is private`

  ariaLabelCopyOrcidId = $localize`:@@topBar.ariaLabelCopyOrcidId:Copy your ORCID iD to the clipboard`
  ariaLabelViewPrintable = $localize`:@@topBar.ariaLabelViewPrintable:View a printable version of your ORCID record (Opens in new tab)`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _state: RecordHeaderStateService,
    private _compact: HeaderCompactService
  ) {}

  ngOnInit(): void {
    // Compact state
    this._compact.compactActive$
      .pipe(takeUntil(this.$destroy))
      .subscribe((active) => (this.compactMode = !!active))

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
        if (this.isPublicRecord) {
          this.loadRecord(this.isPublicRecord)
        }
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

  private loadRecord(publicRecordId: string) {
    this._record
      .getRecord({
        publicRecordId,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        this.userRecord = userRecord
        this.userInfo = userRecord?.userInfo

        if (!isEmpty(this.userRecord?.names)) {
          this.givenNames = RecordUtil.getGivenNames(this.userRecord)
          this.familyName = RecordUtil.getFamilyName(this.userRecord)
          this.creditName = RecordUtil.getCreditName(this.userRecord)
          this.ariaLabelName = RecordUtil.getAriaLabelName(
            this.userRecord,
            this.ariaLabelName
          )
        } else {
          if (
            this.affiliations > 0 ||
            this.displaySideBar ||
            this.displayBiography
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
      })
  }
}
