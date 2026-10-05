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
 * Answer to `signin/recoveryPhone/status.json`: whether the account behind the
 * credentials has a recovery number, so the 2FA step knows which way out to
 * offer (F1.2). Nothing else about the number travels, not even the mask.
 */
export interface RecoveryPhoneSignInStatusResponse {
  success: boolean
  errorCode?: string
  hasRecoveryPhone?: boolean
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
