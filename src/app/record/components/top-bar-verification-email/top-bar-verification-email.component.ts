import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { Subject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { RecordEmailsService } from '../../../core/record-emails/record-emails.service'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'

@Component({
  selector: 'app-top-bar-verification-email',
  templateUrl: './top-bar-verification-email.component.html',
  styleUrls: [
    './top-bar-verification-email.component.scss',
    './top-bar-verification-email.component.scss-theme.scss',
  ],
})
export class TopBarVerificationEmailComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() justRegistered: boolean
  @Input() emailVerified: boolean

  primaryEmail: string
  isMobile: boolean

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _recordEmails: RecordEmailsService,
    private _verificationEmailModalService: VerificationEmailModalService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  ngOnInit(): void {
    this._recordEmails
      .getEmails()
      .pipe(first())
      .subscribe((emails) => {
        const primaryEmail = emails.emails.filter((email) => email.primary)[0]
        if (!primaryEmail.verified) {
          this.primaryEmail = primaryEmail.value
        }
      })
  }

  resendVerificationEmailModal() {
    this._verificationEmailModalService.openVerificationEmailModal(
      this.primaryEmail
    )
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
