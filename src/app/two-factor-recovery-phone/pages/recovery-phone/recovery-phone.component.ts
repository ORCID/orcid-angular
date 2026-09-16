import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import {
  AuthChallengeComponent,
  AuthChallengeRecoveryPhone,
} from '@orcid/registry-ui'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'

import { RecoveryPhoneFormComponent } from '../../../cdk/recovery-phone-form/recovery-phone-form.component'
import { ApplicationRoutes } from '../../../constants'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import {
  AuthChallenge,
  AuthChallengeFormData,
} from '../../../types/common.endpoint'
import { TogglzFlag } from '../../../types/config.endpoint'
import { Status } from '../../../types/two-factor.endpoint'

/**
 * Account settings' add-and-manage page. The form itself lives in
 * `app-recovery-phone-form`; everything here is the page around it: the feature
 * gate, the password challenge that guards this surface, and the way back to
 * account settings.
 */
@Component({
  selector: 'app-recovery-phone',
  templateUrl: './recovery-phone.component.html',
  styleUrls: [
    './recovery-phone.component.scss',
    './recovery-phone.component.scss-theme.scss',
  ],
  standalone: false,
})
export class RecoveryPhoneComponent implements OnInit, OnDestroy {
  private readonly $destroy = new Subject<void>()

  @ViewChild(RecoveryPhoneFormComponent)
  recoveryPhoneForm: RecoveryPhoneFormComponent | undefined

  challengeForm: UntypedFormGroup

  loadingState = true
  /** Set once the user has a number already, which turns this into a change. */
  managingExistingNumber = false
  maskedRecoveryPhoneNumber: string | undefined

  /** Mirrored from the form: the primary action is dead until a code is out. */
  codeSent = false

  cancelLabel = $localize`:@@account.cancel:Cancel`

  private challengeDialog: MatDialogRef<AuthChallengeComponent> | undefined
  private challengePassed = false
  private recoveryPhoneChallenge: AuthChallengeRecoveryPhone | undefined

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _togglz: TogglzService,
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private _recoveryPhoneChallenge: RecoveryPhoneChallengeService
  ) {}

  ngOnInit(): void {
    this.challengeForm = this._fb.group({
      password: [null, Validators.required],
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
      twoFactorRecoveryPhoneCode: [
        null,
        [Validators.minLength(6), Validators.maxLength(6)],
      ],
    })

    this._togglz
      .getStateOf(TogglzFlag.TWO_FACTOR_RECOVERY_PHONE)
      .pipe(first(), takeUntil(this.$destroy))
      .subscribe((enabled) => {
        if (!enabled) {
          this.returnToAccountSettings()
          return
        }
        this.loadStatus()
      })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }

  get title(): string {
    return this.managingExistingNumber
      ? $localize`:@@account.manageRecoveryPhoneTitle:Manage your recovery phone number`
      : $localize`:@@account.addRecoveryPhoneTitle:Add a recovery phone number`
  }

  get primaryLabel(): string {
    return this.managingExistingNumber
      ? $localize`:@@account.updateRecoveryPhoneNumber:Update recovery phone number`
      : $localize`:@@account.addRecoveryPhoneNumber:Add recovery phone number`
  }

  private get challengeDescription(): string {
    return this.managingExistingNumber
      ? $localize`:@@account.manageRecoveryPhoneChallenge:to manage your recovery phone number`
      : $localize`:@@account.addRecoveryPhoneChallenge:to add a recovery phone number`
  }

  private loadStatus(): void {
    this._twoFactorAuthenticationService
      .checkState()
      .pipe(first(), takeUntil(this.$destroy))
      .subscribe({
        next: (status: Status) => {
          if (!status?.enabled) {
            // Nothing to back up when 2FA is off
            this.returnToAccountSettings()
            return
          }
          this.managingExistingNumber = !!status.maskedRecoveryPhoneNumber
          this.maskedRecoveryPhoneNumber = status.maskedRecoveryPhoneNumber
          this.loadingState = false
          this.openAuthChallenge()
        },
        error: () => this.returnToAccountSettings(),
      })
  }

  /**
   * The page is unusable until the challenge passes. The server enforces this
   * too, so a deep link cannot get past it.
   */
  private openAuthChallenge(): void {
    this.recoveryPhoneChallenge = this._recoveryPhoneChallenge.create()
    this.challengeDialog = this._dialog.open<AuthChallengeComponent>(
      AuthChallengeComponent,
      {
        disableClose: true,
        ariaModal: true,
        ariaLabel: this.title,
        data: {
          ...({
            parentForm: this.challengeForm,
            actionDescription: this.challengeDescription,
          } as AuthChallengeFormData),
          recoveryPhone: this.recoveryPhoneChallenge,
        },
      }
    )

    this.challengeDialog.componentInstance.submitAttempt
      .pipe(takeUntil(this.challengeDialog.afterClosed()))
      .subscribe(() => this.submitAuthChallenge())

    this.challengeDialog.componentInstance.cancelAttempt
      .pipe(takeUntil(this.challengeDialog.afterClosed()))
      .subscribe(() => this.challengeDialog?.close(false))

    this.challengeDialog.afterClosed().subscribe((passed) => {
      this.challengeDialog = undefined
      if (passed) {
        this.challengePassed = true
      } else if (!this.challengePassed) {
        this.returnToAccountSettings()
      }
    })
  }

  private submitAuthChallenge(): void {
    const dialogRef = this.challengeDialog
    if (!dialogRef) {
      return
    }

    if (this.recoveryPhoneChallenge?.used) {
      // The only way past this challenge was the very number this page exists
      // to manage, and using it deleted that number and turned 2FA off (R5.3).
      // There is nothing left here to add to or change, so go back to account
      // settings, which now shows 2FA off and no recovery number.
      this.challengePassed = false
      dialogRef.close(false)
      return
    }

    this._twoFactorAuthenticationService
      .verifyRecoveryPhoneChallenge(this.challengeForm.value)
      .pipe(first())
      .subscribe({
        next: (response: AuthChallenge) => {
          if (response.success) {
            dialogRef.close(true)
          } else {
            dialogRef.componentInstance.loading = false
            dialogRef.componentInstance.processBackendResponse(response)
          }
        },
        error: () => {
          dialogRef.componentInstance.loading = false
        },
      })
  }

  /** The page owns the primary button; the form owns what it posts. */
  onPrimaryAction(): void {
    this.recoveryPhoneForm?.save()
  }

  /** The elevation ran out mid form: ask again, and keep what they typed. */
  onChallengeRequired(): void {
    this.challengePassed = false
    this.openAuthChallenge()
  }

  onSaved(): void {
    this.returnToAccountSettings(
      this.managingExistingNumber ? 'updated' : 'added'
    )
  }

  onFailed(): void {
    this.returnToAccountSettings('failed')
  }

  cancel(): void {
    this.returnToAccountSettings()
  }

  private returnToAccountSettings(
    outcome?: 'added' | 'updated' | 'failed'
  ): void {
    this._router.navigate([ApplicationRoutes.account], {
      queryParams: outcome ? { recoveryPhone: outcome } : {},
      fragment: '2FA',
    })
  }
}
