export interface OauthParameters {
  client_id: string
  response_type: string
  scope: string
  redirect_uri: string
  show_login: 'false' | 'true'
  email: string
  lang: string
  given_names: string
  family_names: string
  state: string
  prompt?: 'login' | 'none'
  orcid: string
}
