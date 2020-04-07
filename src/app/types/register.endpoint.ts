import { Value } from './common.endpoint'

export interface RegisterForm {
  errors?: any[]
  sendChangeNotifications?: Value
  sendOrcidNews?: Value
  sendMemberUpdateRequests?: Value
  termsOfUse?: Value
  activitiesVisibilityDefault?: Value
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
  linkType?: any
  approved?: boolean
  persistentTokenEnabled?: boolean
  emailAccessAllowed?: boolean
  redirectUrl?: any
}
