import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { ModalNameComponent } from './modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from './modals/modal-biography/modal-biography.component'
import { takeUntil, tap } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { Assertion, UserInfo } from '../../../types'
import { UserStatus } from '../../../types/userStatus.endpoint'
import { RecordEmailsService } from '../../../core/record-emails/record-emails.service'
import { MatDialog } from '@angular/material/dialog'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { isEmpty } from 'lodash'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { ModalEmailComponent } from 'src/app/cdk/side-bar/modals/modal-email/modal-email.component'
import { WINDOW } from 'src/app/cdk/window'

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: [
        './top-bar.component.scss',
        './top-bar.component.scss-theme.scss',
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class TopBarComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() isPublicRecord: string

  userInfo: UserInfo
  userRecord: UserRecord
  userStatus: UserStatus

  modalNameComponent = ModalNameComponent
  modalBiographyComponent = ModalBiographyComponent

  platform: PlatformInfo
  givenNames = ''
  familyName = ''
  creditName = ''
  otherNames = ''
  expandedContent = false
  recordWithIssues: boolean
  justRegistered: boolean
  emailVerified: boolean
  checkEmailValidated: boolean
  inDelegationMode: boolean

  @Input() newlySharedDomains: string[] = []
  @Input() newAddedAffiliation: string
  @Input() loadingUserRecord = true

  regionNames = $localize`:@@topBar.names:Names`
  regionBiography = $localize`:@@topBar.biography:Biography`

  ariaLabelName: string
  constructor(
    private _dialog: MatDialog,
    _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _recordEmails: RecordEmailsService,
    private _verificationEmailModalService: VerificationEmailModalService,
    @Inject(WINDOW) private window: Window
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
        if (this.platform.queryParameters.hasOwnProperty('justRegistered')) {
          this.justRegistered = true
        }

        if (this.platform.queryParameters.hasOwnProperty('emailVerified')) {
          this.emailVerified = true
        }
      })
    _user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.userStatus = data
      })
  }

  openEmailModal() {
    return this._dialog
      .open(ModalEmailComponent, {
        width: '850px',
        maxWidth: '99%',
      })
      .afterClosed()
  }

  goToAffiliations() {
    this.window.document
      .querySelector('#affiliations')
      .scrollIntoView({ behavior: 'smooth' })
  }

  ngOnInit(): void {
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
        }

        if (!isEmpty(this.userRecord.otherNames?.otherNames)) {
          this.otherNames = RecordUtil.getOtherNamesUnique(
            userRecord.otherNames?.otherNames
          )
        }
      })
  }

  resendVerificationEmailModal(email: string) {
    this._verificationEmailModalService.openVerificationEmailModal(email)
  }

  collapse(): void {
    this.expandedContent = !this.expandedContent
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
