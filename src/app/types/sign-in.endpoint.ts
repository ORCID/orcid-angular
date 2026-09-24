export interface SignIn {
  errors: string[]
  success: any
  email: string
  verificationCodeRequired: any
  deprecated: any
  disabled: any
  unclaimed: any
  badVerificationCode: any
  badRecoveryCode: any
  invalidUserType: any
  url: string
  primary: string
  /**
   * The password was right, but the record has to reset it before it can sign
   * in with one (PD-5692). Only ever sent with `success: false`.
   */
  passwordResetRequired?: boolean
}

/**
 * Answer to `signin/password-reset-status.json`: whether the record behind an
 * email address or ORCID iD has to reset its password before it can sign in.
 * The same answer covers an unknown identifier and the feature being off.
 */
export interface PasswordResetStatusResponse {
  passwordResetRequired: boolean
}

/**
 * Answer to `signin/recoveryPhone/sendCode.json`. The number is never read
 * back: only `***********NNNN` travels (R1.2).
 */
export interface RecoveryPhoneSignInSendResponse {
  success: boolean
  errorCode?: string
  resendAfterSeconds: number
  maskedRecoveryPhoneNumber?: string
}

/**
 * Answer to `signin/recoveryPhone/verify.json`. On success the registry has
 * already disabled 2FA, deleted the number and invalidated the backup codes
 * (R3.5); `orcid` is who that happened to, so the record page can show the
 * notice once.
 */
export interface RecoveryPhoneSignInVerifyResponse {
  success: boolean
  errorCode?: string
  orcid?: string
}
