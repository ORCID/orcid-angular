import { Value, Visibility } from './common.endpoint'

export interface RegisterForm {
  errors?: any[]
  sendChangeNotifications?: Value
  sendOrcidNews?: Value
  sendMemberUpdateRequests?: Value
  termsOfUse?: Value
  activitiesVisibilityDefault?: Visibility
  password?: Value
  passwordConfirm?: Value
  email?: Value
  emailsAdditional?: Value[]
  emailConfirm?: Value
  givenNames?: Value
  familyNames?: Value
  creationType?: Value
  referredBy?: Value
  sendEmailFrequencyDays?: Value
  valNumServer?: number
  valNumClient?: number
  grecaptcha?: Value
  grecaptchaWidgetId?: Value
  linkType?: string
  approved?: boolean
  persistentTokenEnabled?: boolean
  emailAccessAllowed?: boolean
  redirectUrl?: any
}

export interface DuplicatedName {
  orcid: string
  email: string
  givenNames: string
  familyNames: string
  institution: string
  createdDate: string
}

export interface RegisterConfirmResponse {
  errors?: any[]
  url: string
}
