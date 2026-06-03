export type SmsPocProvider = 'aws' | 'twilio'

export interface SmsPocRequest {
  phoneNumber: string
  message: string
  provider?: SmsPocProvider
}

export interface SmsPocResponse {
  success: boolean
  provider: string
  providerMessageId?: string
  normalizedPhoneNumber?: string
  status: string
  errorCode?: string
  errorMessage?: string
}
