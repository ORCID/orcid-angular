import { UserInfo, NameForm, RequestInfoForm } from '.'

export interface UserSession {
  userInfo: UserInfo
  nameForm: NameForm
  oauthSession: RequestInfoForm
  displayName: string
  orcidUrl: string
  effectiveOrcidUrl: string
  loggedIn: boolean
}
