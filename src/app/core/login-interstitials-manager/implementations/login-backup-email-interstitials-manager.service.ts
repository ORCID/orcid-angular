import { Inject, Injectable } from '@angular/core'
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
import { WINDOW } from 'src/app/cdk/window'

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
  // Sign in flow only. Without an OAUTH_ entry getInterstitialTogglz('OAUTH')
  // resolves to false, so the OAuth flow skips this interstitial.
  INTERSTITIAL_TOGGLE: TogglzFlag[] = [
    TogglzFlag.LOGIN_BACKUP_EMAIL_INTERSTITIAL,
  ]

  constructor(
    matDialog: MatDialog,
    interstitialsService: InterstitialsService,
    togglzService: TogglzService,
    qaFlagService: QaFlagsService,
    @Inject(WINDOW) private _window: Window
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
    if (userRecord?.emails?.emails?.length !== 1) return of(false)

    const isImpersonation = !(
      userRecord?.userInfo?.REAL_USER_ORCID ===
      userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    )

    const insidePopUpWindows = !!this._window.opener

    if (isImpersonation || insidePopUpWindows) {
      return of(false)
    }
    return of(true)
  }

  // Return the dialog component that we want to display
  getDialogComponentToShow(): ComponentType<any> {
    return BackupEmailDialogComponent
  }

  // Build the data that goes into our dialog
  getDialogDataToShow(userRecord: UserRecord): BackupEmailComponentDialogInput {
    return {
      userEmailsJson: userRecord.emails,
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
