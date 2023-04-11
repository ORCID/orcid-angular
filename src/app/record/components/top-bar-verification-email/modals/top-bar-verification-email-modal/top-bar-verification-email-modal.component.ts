import { Component, OnDestroy, OnInit } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { Subject } from 'rxjs'
import { RecordEmailsService } from '../../../../../core/record-emails/record-emails.service'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'

@Component({
  selector: 'app-top-bar-verification-email-modal',
  templateUrl: './top-bar-verification-email-modal.component.html',
  styleUrls: [
    './top-bar-verification-email-modal.component.scss',
    './top-bar-verification-email-modal.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class TopBarVerificationEmailModalComponent
  implements OnInit, OnDestroy
{
  ariaLabelKnowledgeBase = $localize`:@@side-bar.ariaLabelOrcidTermsOfUseBase:ORCID knowledge base (Opens in a new tab)`
  ariaLabelKnowledgeSupport = $localize`:@@side-bar.ariaLabelOrcidTermsSupport:ORCID support page (Opens in a new tab)`

  $destroy: Subject<boolean> = new Subject<boolean>()

  primaryEmail: string
  isMobile: boolean

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordEmailsService: RecordEmailsService
  ) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  verifyEmail() {
    this._recordEmailsService
      .verifyEmail(this.primaryEmail)
      .pipe(first())
      .subscribe(() => {
        this.dialogRef.close()
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
  ngOnInit(): void {}
}
