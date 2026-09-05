import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { AuthChallengeComponent } from '@orcid/registry-ui'
import { Subject, Subscription, interval } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'

import { ApplicationRoutes } from '../../../constants'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { AuthChallenge, AuthChallengeFormData } from '../../../types/common.endpoint'
import { TogglzFlag } from '../../../types/config.endpoint'
import {
  RecoveryPhoneErrorCode,
  Status,
} from '../../../types/two-factor.endpoint'

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

  loadUtils = () => import('intl-tel-input/utils')

  form: UntypedFormGroup
  challengeForm: UntypedFormGroup

  loadingState = true
  /** Set once the user has a number already, which turns this into a change. */
  managingExistingNumber = false
  maskedRecoveryPhoneNumber: string | undefined

  codeSent = false
  resendCountdown = 0
  sending = false
  saving = false

  phoneErrorMessage: string | null = null
  codeErrorMessage: string | null = null
  generalErrorMessage: string | null = null

  cancelLabel = $localize`:@@account.cancel:Cancel`

  /** Preselected country, taken from the region the browser reports. */
  initialCountry = 'us'

  /** Country names in the language the registry is being displayed in. */
  countryNameLocale = 'en'

  /** The phone field's own labels and search box, in the same language. */
  uiTranslations: Record<string, string> | undefined

  /**
   * The field reads its translations once, when it initialises, so the form
   * waits for them rather than rendering an English field and updating it.
   */
  translationsReady = false

  private challengeDialog: MatDialogRef<AuthChallengeComponent> | undefined
  private challengePassed = false
  private countdownSubscription: Subscription | undefined

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _togglz: TogglzService,
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService,
    @Inject(LOCALE_ID) private _locale: string
  ) {}

  ngOnInit(): void {
    this.initialCountry = this.resolveInitialCountry()
    this.loadPhoneFieldTranslations()
    this.form = this._fb.group({
      phoneNumber: ['', Validators.required],
      verificationCode: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    })
    this.challengeForm = this._fb.group({
      password: [null, Validators.required],
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
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

  get verificationCodeControl() {
    return this.form.get('verificationCode')
  }

  get phoneNumberControl() {
    return this.form.get('phoneNumber')
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

  /**
   * Picks the country from the region in the browser's locale, e.g. en-GB
   * gives gb. Falls back to the US when the locale carries no region.
   */
  private resolveInitialCountry(): string {
    const locale = navigator?.language || this._locale || ''
    const region = locale.split(/[-_]/)[1]
    return region && region.length === 2 ? region.toLowerCase() : 'us'
  }

  /**
   * The phone field ships its own translations, keyed by language rather than
   * by the locale ids the registry uses, so Chinese needs mapping and anything
   * it does not carry falls back to English rather than rendering blank.
   */
  private loadPhoneFieldTranslations(): void {
    const language = this.resolvePhoneFieldLanguage()
    this.countryNameLocale = language
    if (language === 'en') {
      this.translationsReady = true
      return
    }
    // The whole set is imported and one language picked out of it: a template
    // path cannot be resolved through the package's export map at build time
    import('intl-tel-input/locale')
      .then((locales) => {
        const translations = (locales as Record<string, unknown>)[language]
        if (translations) {
          this.uiTranslations = translations as Record<string, string>
        } else {
          this.countryNameLocale = 'en'
        }
        this.translationsReady = true
      })
      .catch(() => {
        // English is already the field's default, so nothing to undo
        this.countryNameLocale = 'en'
        this.translationsReady = true
      })
  }

  private resolvePhoneFieldLanguage(): string {
    const locale = (this._locale || 'en').toLowerCase()
    if (locale.startsWith('zh')) {
      // The field carries simplified Chinese as zh and traditional as zh-hk
      return locale === 'zh-tw' || locale === 'zh-hant' ? 'zh-hk' : 'zh'
    }
    return locale.split('-')[0]
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
    this.challengeDialog = this._dialog.open<AuthChallengeComponent>(
      AuthChallengeComponent,
      {
        disableClose: true,
        data: {
          parentForm: this.challengeForm,
          actionDescription: this.challengeDescription,
        } as AuthChallengeFormData,
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

  sendCode(): void {
    this.clearErrors()
    if (this.phoneNumberControl?.invalid) {
      this.phoneNumberControl.markAsTouched()
      this.phoneErrorMessage = this.localPhoneErrorMessage()
      return
    }

    this.sending = true
    this._twoFactorAuthenticationService
      .sendRecoveryPhoneCode({
        phoneNumber: this.phoneNumberControl?.value,
        locale: this._locale,
      })
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.sending = false
          if (response.success) {
            this.codeSent = true
            this.verificationCodeControl?.enable()
            this.startResendCountdown(response.resendAfterSeconds)
          } else {
            this.handleErrorCode(response.errorCode, response.resendAfterSeconds)
          }
        },
        error: () => {
          this.sending = false
          this.generalErrorMessage = $localize`:@@account.recoveryPhoneSendFailed:We could not send a verification code. Please try again.`
        },
      })
  }

  save(): void {
    this.clearErrors()
    // A disabled control counts as valid, so check the value we actually have
    const code: string = this.verificationCodeControl?.value || ''
    if (!code) {
      this.verificationCodeControl?.markAsTouched()
      this.codeErrorMessage = $localize`:@@account.verificationCodeRequired:A verification code is required`
      return
    }
    if (code.length !== 6) {
      this.verificationCodeControl?.markAsTouched()
      this.codeErrorMessage = $localize`:@@account.invalidVerificationCodeLength:Invalid verification code length`
      return
    }

    this.saving = true
    this._twoFactorAuthenticationService
      .saveRecoveryPhone({
        phoneNumber: this.phoneNumberControl?.value,
        verificationCode: code,
      })
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.saving = false
          if (response.success) {
            this.returnToAccountSettings(
              this.managingExistingNumber ? 'updated' : 'added'
            )
          } else {
            this.handleErrorCode(response.errorCode)
          }
        },
        error: () => {
          this.saving = false
          this.returnToAccountSettings('failed')
        },
      })
  }

  cancel(): void {
    this.returnToAccountSettings()
  }

  /**
   * Counts down from the server's own resend buffer, so the button re-enables
   * at the same moment the backend starts accepting another send.
   */
  private startResendCountdown(seconds: number): void {
    // Drop any countdown still running, or two of them would race and the
    // button would come back before the server accepts another send
    this.countdownSubscription?.unsubscribe()
    this.resendCountdown = seconds
    if (seconds <= 0) {
      return
    }
    this.phoneNumberControl?.disable()
    this.countdownSubscription = interval(1000)
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.resendCountdown--
        if (this.resendCountdown <= 0) {
          this.resendCountdown = 0
          this.countdownSubscription?.unsubscribe()
          this.phoneNumberControl?.enable()
        }
      })
  }

  /**
   * The phone field validates as you type and knows why a number is wrong, so
   * say which problem it is rather than sending everything to the server and
   * calling it all "required".
   */
  private localPhoneErrorMessage(): string {
    const control = this.phoneNumberControl
    if (!control?.value) {
      return $localize`:@@account.recoveryPhoneRequired:Phone number is required`
    }
    const reason = String(control.errors?.['invalidPhone'] ?? '')
    if (reason.includes('TOO_SHORT') || reason.includes('LOCAL_ONLY') || reason.includes('INVALID_LENGTH')) {
      return $localize`:@@account.recoveryPhoneTooShort:Phone number is too short`
    }
    if (reason.includes('TOO_LONG')) {
      return $localize`:@@account.recoveryPhoneTooLong:Phone number is too long`
    }
    return $localize`:@@account.recoveryPhoneInvalid:Phone number is invalid`
  }

  private handleErrorCode(
    errorCode: RecoveryPhoneErrorCode | undefined,
    resendAfterSeconds = 0
  ): void {
    switch (errorCode) {
      case 'PHONE_TOO_SHORT':
        this.phoneErrorMessage = $localize`:@@account.recoveryPhoneTooShort:Phone number is too short`
        break
      case 'PHONE_TOO_LONG':
        this.phoneErrorMessage = $localize`:@@account.recoveryPhoneTooLong:Phone number is too long`
        break
      case 'INVALID_PHONE_NUMBER':
        this.phoneErrorMessage = $localize`:@@account.recoveryPhoneInvalid:Phone number is invalid`
        break
      case 'PHONE_MISMATCH':
        this.codeErrorMessage = $localize`:@@account.recoveryPhoneMismatch:This code was sent to a different number. Send a new code to this number.`
        break
      case 'RESEND_TOO_SOON':
        this.startResendCountdown(resendAfterSeconds)
        break
      case 'INVALID_CODE':
        this.codeErrorMessage = $localize`:@@account.invalidVerificationCode:Invalid verification code`
        break
      case 'CODE_EXPIRED':
      case 'TOO_MANY_ATTEMPTS':
        this.resetCodeEntry()
        this.codeErrorMessage = $localize`:@@account.verificationCodeExpired:That code is no longer valid. Send a new code.`
        break
      case 'CHALLENGE_REQUIRED':
        // The elevation ran out mid form; ask again and keep what they typed
        this.challengePassed = false
        this.openAuthChallenge()
        break
      case '2FA_DISABLED':
      case 'FEATURE_DISABLED':
        this.returnToAccountSettings('failed')
        break
      default:
        this.generalErrorMessage = $localize`:@@account.recoveryPhoneGenericError:Something went wrong. Please try again.`
    }
  }

  private resetCodeEntry(): void {
    this.codeSent = false
    this.resendCountdown = 0
    this.verificationCodeControl?.reset('')
    this.verificationCodeControl?.disable()
    this.phoneNumberControl?.enable()
  }

  private clearErrors(): void {
    this.phoneErrorMessage = null
    this.codeErrorMessage = null
    this.generalErrorMessage = null
  }

  private returnToAccountSettings(outcome?: 'added' | 'updated' | 'failed'): void {
    this._router.navigate([ApplicationRoutes.account], {
      queryParams: outcome ? { recoveryPhone: outcome } : {},
      fragment: '2FA',
    })
  }
}
