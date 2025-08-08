import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { RecordService } from 'src/app/core/record/record.service'
import { PlatformInfoService } from '../platform-info'

@Component({
    selector: 'app-top-bar-verification-email',
    templateUrl: './top-bar-verification-email.component.html',
    styleUrls: [
        './top-bar-verification-email.component.scss',
        './top-bar-verification-email.component.scss-theme.scss',
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class TopBarVerificationEmailComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() emailVerified: boolean
  @Input() justRegistered: boolean
  @Input() messageType: 'forCredentials' | 'forManualEditing' =
    'forManualEditing'

  primaryEmail: string
  verifyEmailSend: boolean
  isMobile: boolean

  constructor(
    _platform: PlatformInfoService,
    private _record: RecordService,
    private _recordEmailsService: RecordEmailsService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  ngOnInit(): void {
    this._record
      .getRecord()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        const primaryEmail = userRecord?.emails?.emails?.filter(
          (email) => email.primary
        )[0]
        if (!primaryEmail?.verified) {
          this.primaryEmail = primaryEmail?.value
        }
      })
  }

  verifyEmail() {
    this._recordEmailsService
      .verifyEmail(this.primaryEmail)
      .pipe(first())
      .subscribe(() => {
        this.verifyEmailSend = true
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
