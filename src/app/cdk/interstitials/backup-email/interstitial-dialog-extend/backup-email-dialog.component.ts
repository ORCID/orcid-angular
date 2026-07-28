import { Component, Inject } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from 'src/app/core/login-interstitials-manager/abstractions/dialog-interface'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { RecordService } from 'src/app/core/record/record.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { EmailsEndpoint } from 'src/app/types'
import { BackupEmailComponent } from '../interstitial-component/backup-email.component'

export interface BackupEmailComponentDialogInput
  extends BaseInterstitialDialogInput {
  type: 'backup-email-interstitial'
  userEmailsJson: EmailsEndpoint
}
export interface BackupEmailComponentDialogOutput
  extends BaseInterstitialDialogOutput {
  type: 'backup-email-interstitial'
  addedBackupEmail?: string
}

@Component({
  templateUrl: '../interstitial-component/backup-email.component.html',
  styleUrls: [
    './backup-email-dialog.component.scss',
    '../interstitial-component/backup-email.component.scss',
    '../interstitial-component/backup-email.component.scss-theme.scss',
  ],
  standalone: false,
})
export class BackupEmailDialogComponent extends BackupEmailComponent {
  constructor(
    platformInfo: PlatformInfoService,
    fb: FormBuilder,
    recordEmailsService: RecordEmailsService,
    _recordService: RecordService,
    registerService: RegisterService,
    interstitialObservability: InterstitialObservabilityService,
    @Inject(WINDOW) window: Window,
    @Inject(MAT_DIALOG_DATA)
    public data: BackupEmailComponentDialogInput,
    public dialogRef: MatDialogRef<
      BackupEmailDialogComponent,
      BackupEmailComponentDialogOutput
    >
  ) {
    super(
      platformInfo,
      fb,
      recordEmailsService,
      _recordService,
      registerService,
      interstitialObservability,
      window
    )
    if (this.data) {
      this.userEmailsJson = this.data.userEmailsJson
    }
  }

  override finishIntertsitial(email?: string) {
    this.dialogRef.close({
      type: 'backup-email-interstitial',
      addedBackupEmail: email,
    })
  }
}
