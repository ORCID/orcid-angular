import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from 'src/app/core/login-interstitials-manager/abstractions/dialog-interface'
import { BackupEmailComponent } from '../interstitial-component/backup-email.component'

export interface BackupEmailComponentDialogInput
  extends BaseInterstitialDialogInput {
  type: 'backup-email-interstitial'
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
  public data = inject<BackupEmailComponentDialogInput>(MAT_DIALOG_DATA)
  public dialogRef =
    inject<
      MatDialogRef<BackupEmailDialogComponent, BackupEmailComponentDialogOutput>
    >(MatDialogRef)

  override finishIntertsitial(email?: string) {
    this.dialogRef.close({
      type: 'backup-email-interstitial',
      addedBackupEmail: email,
    })
  }
}
