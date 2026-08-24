import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Observable, of } from 'rxjs'

import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'

import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { TogglzService } from '../../togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { LoginBaseInterstitialManagerService } from '../abstractions/login-abstract-interstitial-manager.service'
import { BackupEmailComponent } from 'src/app/cdk/interstitials/backup-email/interstitial-component/backup-email.component'
import {
  BackupEmailComponentDialogInput,
  BackupEmailComponentDialogOutput,
  BackupEmailDialogComponent,
} from 'src/app/cdk/interstitials/backup-email/interstitial-dialog-extend/backup-email-dialog.component'

@Injectable({
  providedIn: 'root',
})
export class LoginBackupEmailInterstitialManagerService extends LoginBaseInterstitialManagerService<
  BackupEmailComponentDialogInput,
  BackupEmailComponentDialogOutput,
  BackupEmailComponent
> {
  QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN =
    QaFlag.forceBackupEmailInterstitialNotSeem
  INTERSTITIAL_NAME: InterstitialType = 'BACKUP_EMAIL_INTERSTITIAL'
  // One entry per flow. getInterstitialTogglz() picks by LOGIN_/OAUTH_ prefix,
  // so a missing entry silently disables the interstitial for that flow.
  INTERSTITIAL_TOGGLE: TogglzFlag[] = [
    TogglzFlag.LOGIN_BACKUP_EMAIL_INTERSTITIAL,
    TogglzFlag.OAUTH_BACKUP_EMAIL_INTERSTITIAL,
  ]

  constructor(
    matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService
  ) {
    // Pass dependencies to the parent
    super(matDialog, togglzService, interstitialsService, qaFlagService)
  }

  /**
   * Decide if the backup email interstitial should be shown.
   * Returns an Observable<boolean> that emits `true` if it *should* show, or `false` if not.
   */
  userIsElegibleForInterstitial(userRecord: UserRecord): Observable<boolean> {
    // Every email on the record counts, whether or not it has been verified
    const hasExactlyOneEmail = userRecord?.emails?.emails?.length === 1
    return of(hasExactlyOneEmail && !this.isBlockedContext(userRecord))
  }

  // Return the dialog component that we want to display
  getDialogComponentToShow(): ComponentType<any> {
    return BackupEmailDialogComponent
  }

  // The component reads the record itself, so the dialog carries only its
  // discriminator
  getDialogDataToShow(userRecord: UserRecord): BackupEmailComponentDialogInput {
    return {
      type: 'backup-email-interstitial',
    }
  }

  getComponentToShow(): ComponentType<BackupEmailComponent> {
    return BackupEmailComponent
  }

  /**
   * The shared config leaves the dialog without an accessible name and with
   * aria-modal off, so screen readers announce an unnamed dialog and can still
   * reach the record behind it.
   */
  protected override getDefaultDialogConfig(
    data: BackupEmailComponentDialogInput
  ): MatDialogConfig<BackupEmailComponentDialogInput> {
    return {
      ...super.getDefaultDialogConfig(data),
      ariaLabel: $localize`:@@shared.dialogAriaLabeledByBackupEmail:Add a backup email address dialog`,
      ariaModal: true,
    }
  }
}
