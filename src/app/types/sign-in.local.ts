import { DeclareOauthSession } from './declareOauthSession.endpoint'

export interface SignInLocal {
  data: FormSignIn
  type: TypeSignIn
  params: DeclareOauthSession
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
}
