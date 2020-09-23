import { UserInfo, NameForm, RequestInfoForm } from '.'

export interface UserSession {
  userInfo: UserInfo
  nameForm: NameForm
  oauthSession: RequestInfoForm
  oauthSessionIsLoggedIn: boolean
  displayName: string
  orcidUrl: string
  effectiveOrcidUrl: string
  loggedIn: boolean
}

export interface UserSessionUpdateParameters {
  checkTrigger: {
    forceSessionUpdate?: boolean
    postLoginUpdate?: boolean
    timerUpdate?: number
  }
  loggedIn: boolean
}
