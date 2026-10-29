import { AuthChallenge, ExtendedDate } from './common.endpoint'

export interface TwoFactor {
  orcid?: string
  recoveryCode?: string
  redirectUrl?: string
  verificationCode: string
  errors?: any[]
}

export interface TwoFactorSetup {
  verificationCode: string
  valid?: boolean
  backupCodes?: string[]
}

export interface QrCode {
  url: string
}

export interface Status extends AuthChallenge {
  enabled: boolean
  twoFactorCreationDate: ExtendedDate
  recoveryCodeCreationDate: ExtendedDate
  // Only ever the last four digits. The one response carrying the number in
  // full is `2FA/recoveryPhone/number.json`, for the manage page (F4.2)
  maskedRecoveryPhoneNumber?: string
  recoveryPhoneCreationDate?: ExtendedDate
  recoveryPhoneLastModifiedDate?: ExtendedDate
  recoveryPhoneModified?: boolean
}

export type RecoveryPhoneErrorCode =
  | 'INVALID_PHONE_NUMBER'
  | 'PHONE_TOO_SHORT'
  | 'PHONE_TOO_LONG'
  | 'RESEND_TOO_SOON'
  | 'SMS_SEND_FAILED'
  | 'SMS_RECIPIENT_NOT_ALLOWED'
  | 'SMS_PROVIDER_NOT_CONFIGURED'
  | 'CODE_STORAGE_UNAVAILABLE'
  | 'SEND_LIMIT_REACHED'
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'TOO_MANY_ATTEMPTS'
  | 'PHONE_MISMATCH'
  | 'CHALLENGE_REQUIRED'
  | '2FA_DISABLED'
  | 'FEATURE_DISABLED'
  | 'BAD_CREDENTIALS'
  | 'NO_RECOVERY_PHONE'
  | 'NOT_ACCOUNT_OWNER'

/**
 * Which flow asked for the number. The registry reads it to decide what it
 * demands before it will send or save: a password challenge in account
 * settings, a 2FA registration that has just completed during onboarding, or a
 * fresh login behind the sign-in interstitial. Absent means SETTINGS.
 */
export type RecoveryPhoneContext = 'SETTINGS' | 'ONBOARDING' | 'INTERSTITIAL'

export interface RecoveryPhoneSendCodeRequest {
  phoneNumber: string
  locale?: string
  context?: RecoveryPhoneContext
}

export interface RecoveryPhoneSendCodeResponse {
  success: boolean
  errorCode?: RecoveryPhoneErrorCode
  resendAfterSeconds: number
}

export interface RecoveryPhoneSaveRequest {
  phoneNumber: string
  verificationCode: string
  context?: RecoveryPhoneContext
}

export interface RecoveryPhoneSaveResponse {
  success: boolean
  errorCode?: RecoveryPhoneErrorCode
  maskedRecoveryPhoneNumber?: string
  recoveryPhoneCreationDate?: ExtendedDate
  recoveryPhoneLastModifiedDate?: ExtendedDate
  recoveryPhoneModified?: boolean
}

/**
 * Answer to `2FA/recoveryPhone/number.json`: the stored number in full, E.164,
 * for the manage page's field and nothing else (F4.2). Only the account owner,
 * on a session that has just passed the challenge, gets `phoneNumber`; keep it
 * in the form control and nowhere else (F4.3).
 */
export interface RecoveryPhoneNumberResponse {
  success: boolean
  errorCode?: RecoveryPhoneErrorCode
  phoneNumber?: string
}
