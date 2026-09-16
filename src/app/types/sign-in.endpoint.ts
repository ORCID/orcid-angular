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
