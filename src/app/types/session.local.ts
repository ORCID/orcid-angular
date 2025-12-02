import { UserInfo, NameForm } from '.'
import { LegacyOauthRequestInfoForm } from './request-info-form.endpoint'
import { ThirdPartyAuthData } from './sign-in-data.endpoint'

export interface UserSession {
  userInfo: UserInfo
  nameForm: NameForm
  oauthSession: LegacyOauthRequestInfoForm
  oauthSessionIsLoggedIn: boolean
  displayName: string
  orcidUrl: string
  effectiveOrcidUrl: string
  loggedIn: boolean
  thirdPartyAuthData: ThirdPartyAuthData
}

export interface UserSessionUpdateParameters {
  checkTrigger: {
    forceSessionUpdate?: boolean
    postLoginUpdate?: boolean
    timerUpdate?: number
  }
  loggedIn: boolean
}
