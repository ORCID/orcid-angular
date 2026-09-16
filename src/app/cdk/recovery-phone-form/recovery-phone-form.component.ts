import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import IntlTelInput from '@intl-tel-input/angular'
import { AlertMessageComponent } from '@orcid/ui'
import { Subject, Subscription, interval } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'

import { TwoFactorAuthenticationService } from '../../core/two-factor-authentication/two-factor-authentication.service'
import {
  RecoveryPhoneContext,
  RecoveryPhoneErrorCode,
  RecoveryPhoneSaveResponse,
} from '../../types/two-factor.endpoint'

/**
 * The recovery phone number form on its own: a country-and-number field, the
 * consent copy, a send control with its resend countdown, and the code field.
 *
 * It is deliberately ignorant of where it is rendered. Account settings, the
 * 2FA onboarding step and the sign-in interstitial each own their own heading,
 * notice and primary button, and drive this component through `context`,
 * `save()` and the outputs below. In particular it never opens a dialog: a
 * challenge that the backend asks for is reported through `challengeRequired`
 * and answered by whoever hosts the form.
 */
@Component({
  selector: 'app-recovery-phone-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    IntlTelInput,
    AlertMessageComponent,
  ],
  templateUrl: './recovery-phone-form.component.html',
  styleUrls: [
    './recovery-phone-form.component.scss',
    './recovery-phone-form.component.scss-theme.scss',
  ],
})
export class RecoveryPhoneFormComponent implements OnInit, OnDestroy {
  private readonly $destroy = new Subject<void>()

  /**
   * Which flow the form is rendered in. The backend reads it to decide what it
   * demands before it will send or save: a password challenge, a 2FA
   * registration that has just completed, or a fresh login.
   */
  @Input() context: RecoveryPhoneContext = 'SETTINGS'

  /** Set once the user has a number already, which turns this into a change. */
  @Input() managingExistingNumber = false

  /** Only ever the last four digits; the registry never reads the number back. */
  @Input() maskedRecoveryPhoneNumber?: string

  /**
   * Hosts that print their own heading — the onboarding step and the
   * interstitial — turn this off to avoid a second one.
   */
  @Input() showHeading = true

  /** Fires on every change of `codeSent`, so a host can enable its own action. */
  @Output() codeSentChange = new EventEmitter<boolean>()

  @Output() saved = new EventEmitter<RecoveryPhoneSaveResponse>()

  /** The error code the registry answered with, or `HTTP` when it never did. */
  @Output() failed = new EventEmitter<string>()

  @Output() challengeRequired = new EventEmitter<void>()

  /** Translations loaded: the form is renderable. */
  @Output() ready = new EventEmitter<void>()

  loadUtils = () => import('intl-tel-input/utils')

  form: UntypedFormGroup

  codeSent = false
  resendCountdown = 0
  sending = false
  saving = false

  /**
   * The number the outstanding code was sent to, held from the moment it was
   * sent: the field can be edited again once the resend delay is over, and the
   * confirmation still has to name the number the code actually went to. It is
   * shown in full - it is what the user just typed into the field above, not
   * anything the registry read back.
   */
  sentToNumber: string | undefined

  phoneErrorMessage: string | null = null
  codeErrorMessage: string | null = null
  generalErrorMessage: string | null = null

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

  private countdownSubscription: Subscription | undefined

  constructor(
    private _fb: UntypedFormBuilder,
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService,
    @Inject(LOCALE_ID) private _locale: string
  ) {}

  ngOnInit(): void {
    this.initialCountry = this.resolveInitialCountry()
    this.form = this._fb.group({
      phoneNumber: ['', Validators.required],
      verificationCode: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    })
    this.loadPhoneFieldTranslations()
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }

  get verificationCodeControl() {
    return this.form?.get('verificationCode')
  }

  get phoneNumberControl() {
    return this.form?.get('phoneNumber')
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
      this.markTranslationsReady()
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
        this.markTranslationsReady()
      })
      .catch(() => {
        // English is already the field's default, so nothing to undo
        this.countryNameLocale = 'en'
        this.markTranslationsReady()
      })
  }

  private markTranslationsReady(): void {
    this.translationsReady = true
    this.ready.emit()
  }

  private resolvePhoneFieldLanguage(): string {
    const locale = (this._locale || 'en').toLowerCase()
    if (locale.startsWith('zh')) {
      // The field carries simplified Chinese as zh and traditional as zh-hk
      return locale === 'zh-tw' || locale === 'zh-hant' ? 'zh-hk' : 'zh'
    }
    return locale.split('-')[0]
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
        context: this.context,
      })
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.sending = false
          if (response.success) {
            this.setCodeSent(true)
            this.sentToNumber = this.phoneNumberControl?.value
            this.verificationCodeControl?.enable()
            this.startResendCountdown(response.resendAfterSeconds)
          } else {
            this.handleErrorCode(
              response.errorCode,
              response.resendAfterSeconds
            )
          }
        },
        error: () => {
          this.sending = false
          this.generalErrorMessage = $localize`:@@account.recoveryPhoneSendFailed:We could not send a verification code. Please try again.`
        },
      })
  }

  /**
   * Posts the number and the code. The host calls this from whatever primary
   * button it renders, so the guards below are the only thing standing between
   * a half-filled form and the registry.
   */
  public save(): void {
    if (this.saving) {
      return
    }
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
        context: this.context,
      })
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.saving = false
          if (response.success) {
            this.saved.emit(response)
          } else {
            this.handleErrorCode(response.errorCode)
          }
        },
        error: () => {
          this.saving = false
          this.failed.emit('HTTP')
        },
      })
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
    if (
      reason.includes('TOO_SHORT') ||
      reason.includes('LOCAL_ONLY') ||
      reason.includes('INVALID_LENGTH')
    ) {
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
        // The elevation ran out mid form. The host owns the challenge, so all
        // this component does is say so and keep what the user typed.
        this.challengeRequired.emit()
        break
      case '2FA_DISABLED':
      case 'FEATURE_DISABLED':
        this.failed.emit(errorCode)
        break
      default:
        this.generalErrorMessage = $localize`:@@account.recoveryPhoneGenericError:Something went wrong. Please try again.`
    }
  }

  private resetCodeEntry(): void {
    this.setCodeSent(false)
    this.sentToNumber = undefined
    this.resendCountdown = 0
    this.verificationCodeControl?.reset('')
    this.verificationCodeControl?.disable()
    this.phoneNumberControl?.enable()
  }

  private setCodeSent(value: boolean): void {
    if (this.codeSent === value) {
      return
    }
    this.codeSent = value
    this.codeSentChange.emit(value)
  }

  private clearErrors(): void {
    this.phoneErrorMessage = null
    this.codeErrorMessage = null
    this.generalErrorMessage = null
  }
}
