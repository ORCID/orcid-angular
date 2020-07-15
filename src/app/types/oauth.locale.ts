import { DeclareOauthSession } from './declareOauthSession.endpoint'

export interface OauthParameters extends DeclareOauthSession {
  show_login: 'false' | 'true'
  email: string
  lang: string
  given_names: string
  family_names: string
  state: string
}
