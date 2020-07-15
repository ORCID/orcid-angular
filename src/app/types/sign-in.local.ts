import { OauthParameters } from '.'

export interface SignInLocal {
  data: FormSignIn
  type: TypeSignIn
  params: OauthParameters
}

export interface FormSignIn {
  username: string
  password: string
  verificationCode: string
  recoveryCode: string
  oauthRequest: string
}

export enum TypeSignIn {
  'personal',
  'institutional',
  'oauth',
  'social',
}
