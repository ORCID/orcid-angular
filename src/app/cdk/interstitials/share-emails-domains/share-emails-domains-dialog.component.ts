import { Component, EventEmitter, Inject, Input, Output } from '@angular/core'
import { PlatformInfoService } from '../../platform-info'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import { WINDOW } from '../../window'
import {
  MAT_LEGACY_DIALOG_DATA,
  MatLegacyDialogRef,
  MatLegacyDialogState,
} from '@angular/material/legacy-dialog'
import { ShareEmailsDomainsComponent } from './share-emails-domains.component'

export type ShareEmailsDomainsComponentDialogInput = {
  userEmailsJson: EmailsEndpoint
  organizationName?: string
}

@Component({
  templateUrl: './share-emails-domains.component.html',
  styleUrls: [
    './share-emails-domains.component.scss',
    './share-emails-domains.component.scss-theme.scss',
    './share-emails-domains-dialog.component.scss',
  ],
})
export class ShareEmailsDomainsDialogComponent extends ShareEmailsDomainsComponent {
  constructor(
    platformInfo: PlatformInfoService,
    fb: FormBuilder,
    recordEmailsService: RecordEmailsService,
    @Inject(WINDOW) window: Window,
    @Inject(MAT_LEGACY_DIALOG_DATA)
    public data: ShareEmailsDomainsComponentDialogInput,
    public dialogRef: MatLegacyDialogRef<ShareEmailsDomainsDialogComponent>
  ) {
    super(platformInfo, fb, recordEmailsService, window)
    if (this.data) {
      this.userEmailsJson = this.data.userEmailsJson
      this.organizationName = this.data.organizationName
      this.dialogMode = true
    }
  }

  override finishIntertsitial(emails?: string[]) {
    this.dialogRef.close(emails)
  }

  override afterEmailUpdates(emails: string[]) {
    this.finishIntertsitial(emails)
  }
}
