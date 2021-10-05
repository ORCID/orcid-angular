import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { ModalNameComponent } from './modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from './modals/modal-biography/modal-biography.component'
import { first, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { isEmpty } from 'lodash'
import { Assertion, UserInfo } from '../../../types'
import { UserStatus } from '../../../types/userStatus.endpoint'
import { RecordEmailsService } from '../../../core/record-emails/record-emails.service'
import { TopBarVerificationEmailModalComponent } from '../top-bar-verification-email/modals/top-bar-verification-email-modal/top-bar-verification-email-modal.component'
import { MatDialog } from '@angular/material/dialog'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: [
    './top-bar.component.scss',
    './top-bar.component.scss-theme.scss',
  ],
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
  expandedContent = false
  recordWithIssues: boolean
  justRegistered: boolean
  emailVerified: boolean
  checkEmailValidated: boolean
  inDelegationMode: boolean
  @Input() loadingUserRecord = true

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _recordEmails: RecordEmailsService,
    private _verificationEmailModalService: VerificationEmailModalService
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

  ngOnInit(): void {
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(first())
      .subscribe((userRecord) => {
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        this.userRecord = userRecord
        this.userInfo = userRecord.userInfo
        this.checkEmailValidated = (userRecord?.userInfo?.IS_PRIMARY_EMAIL_VERIFIED === 'true')
        this.inDelegationMode = (userRecord?.userInfo?.IN_DELEGATION_MODE === 'true')

        if (!this.checkEmailValidated && !this.inDelegationMode) {
          this._recordEmails
            .getEmails()
            .pipe(first())
            .subscribe((emails) => {
              const primaryEmail = emails.emails.filter(email => email.primary)[0]
              if (!primaryEmail.verified) {
                this.resendVerificationEmailModal(primaryEmail.value)
              }
            })
        }
        if (!isEmpty(userRecord.otherNames)) {
          this.setNames(userRecord)
        }
      })
  }

  private setNames(userRecord: UserRecord) {
    this.givenNames = this.userRecord?.names?.givenNames
      ? this.userRecord.names.givenNames.value
      : ''
    this.familyName = this.userRecord?.names?.familyName
      ? this.userRecord.names.familyName.value
      : ''
    this.creditName = this.userRecord?.names?.creditName
      ? this.userRecord.names.creditName.value
      : ''
  }

  getOtherNamesUnique(otherNames: Assertion[]): string {
    return otherNames
      .map((otherName) => {
        return otherName.content
      })
      .filter(function (item, pos, array) {
        return array.indexOf(item) === pos
      })
      .join(', ')
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
