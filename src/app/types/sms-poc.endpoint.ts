export type SmsPocProvider = 'aws' | 'twilio'

export interface SmsPocRequest {
  phoneNumber: string
  provider?: SmsPocProvider
  /** UI locale (BCP 47); the backend picks a localized SMS template and falls back to English. */
  locale?: string
}

export interface SmsVerificationCheckRequest {
  phoneNumber: string
  code: string
}

export interface SmsPocResponse {
  success: boolean
  provider: string
  providerMessageId?: string
  normalizedPhoneNumber?: string
  status: string
  verified?: boolean
  errorCode?: string
  errorMessage?: string
}
