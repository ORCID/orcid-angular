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

export interface Status {
  enabled: boolean
}
