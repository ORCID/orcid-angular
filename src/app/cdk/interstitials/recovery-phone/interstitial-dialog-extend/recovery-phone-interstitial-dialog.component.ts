import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import {
  BaseInterstitialDialogInput,
  RecoveryPhoneComponentDialogOutput,
} from 'src/app/core/login-interstitials-manager/abstractions/dialog-interface'
import { RecoveryPhoneInterstitialComponent } from '../interstitial-component/recovery-phone-interstitial.component'

export interface RecoveryPhoneComponentDialogInput
  extends BaseInterstitialDialogInput {
  type: 'recovery-phone-interstitial'
}

// Unlike the other three, the matching output interface is not declared here:
// it lives in `abstractions/dialog-interface.ts` so the record page can read
// the result without importing this dialog.

@Component({
  templateUrl:
    '../interstitial-component/recovery-phone-interstitial.component.html',
  styleUrls: [
    './recovery-phone-interstitial-dialog.component.scss',
    '../interstitial-component/recovery-phone-interstitial.component.scss',
    '../interstitial-component/recovery-phone-interstitial.component.scss-theme.scss',
  ],
  standalone: false,
})
export class RecoveryPhoneInterstitialDialogComponent extends RecoveryPhoneInterstitialComponent {
  public data = inject<RecoveryPhoneComponentDialogInput>(MAT_DIALOG_DATA)
  public dialogRef =
    inject<
      MatDialogRef<
        RecoveryPhoneInterstitialDialogComponent,
        RecoveryPhoneComponentDialogOutput
      >
    >(MatDialogRef)

  /**
   * Close straight away rather than swapping in a confirmation. The record
   * banner is what acknowledges the save on this flow (R6.4), and this
   * interstitial has no inline flow that would need a panel of its own.
   */
  override afterSummit(maskedRecoveryPhoneNumber?: string) {
    this.finishIntertsitial(maskedRecoveryPhoneNumber)
  }

  /**
   * Only ever the masked number: the registry cannot read the number back, and
   * nothing outside `profile_recovery_phone` carries it in full (R1.2).
   */
  override finishIntertsitial(maskedRecoveryPhoneNumber?: string) {
    this.dialogRef.close({
      type: 'recovery-phone-interstitial',
      addedRecoveryPhone: maskedRecoveryPhoneNumber,
    })
  }
}
