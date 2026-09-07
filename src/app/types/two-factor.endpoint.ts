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
  // Only ever the last four digits: the registry cannot read the number back
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
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'TOO_MANY_ATTEMPTS'
  | 'PHONE_MISMATCH'
  | 'CHALLENGE_REQUIRED'
  | '2FA_DISABLED'
  | 'FEATURE_DISABLED'

export interface RecoveryPhoneSendCodeRequest {
  phoneNumber: string
  locale?: string
}

export interface RecoveryPhoneSendCodeResponse {
  success: boolean
  errorCode?: RecoveryPhoneErrorCode
  resendAfterSeconds: number
}

export interface RecoveryPhoneSaveRequest {
  phoneNumber: string
  verificationCode: string
}

export interface RecoveryPhoneSaveResponse {
  success: boolean
  errorCode?: RecoveryPhoneErrorCode
  maskedRecoveryPhoneNumber?: string
  recoveryPhoneCreationDate?: ExtendedDate
  recoveryPhoneLastModifiedDate?: ExtendedDate
  recoveryPhoneModified?: boolean
}
