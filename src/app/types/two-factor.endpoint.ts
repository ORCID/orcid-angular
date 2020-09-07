export interface TwoFactor {
  recoveryCode: string
  redirectUrl: string
  verificationCode: string
  errors: any[]
}
