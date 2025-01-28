import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { Assertion, UserInfo } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'


@Component({
  selector: 'app-record-header',
  templateUrl: './record-header.component.html',
  styleUrls: [
    './record-header.component.scss',
    './record-header.component.scss-theme.scss',
  ],
})
export class RecordHeaderComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() loadingUserRecord = true
  @Input() isPublicRecord: string
  @Input() affiliations: number
  @Input() displaySideBar: boolean
  @Input() displayBiography: boolean
  _recordSummaryOpen: boolean

  ariaLabelFindoutMore = RecordUtil.appendOpensInNewTab(
    $localize`:@@summary.findOutMoreAboutRecordSummaries:Find out more about record summaries`
  )

  @Input()
  set recordSummaryOpen(value: boolean) {
    this._recordSummaryOpen = value
    this.recordSummaryOpenChange.emit(this._recordSummaryOpen)
  }
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
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    this.orcidId = 'https:' + runtimeEnvironment.BASE_URL + this.isPublicRecord

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })

    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
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
    this.recordSummaryOpen = !this.recordSummaryOpen
  }
}
