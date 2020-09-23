import { OauthParameters } from '.'

export interface SignInLocal {
  data: FormSignIn
  type: TypeSignIn
  isOauth: boolean
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
  'social',
}
