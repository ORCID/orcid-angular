export interface OauthParameters {
  show_login: 'false' | 'true'
  email: string
  lang: string
  given_names: string
  family_names: string
  state: string
  redirect_uri: string
  response_type: string
  scope: string
  client_id: string
}
