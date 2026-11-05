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
  /**
   * The code texted to the account's recovery phone number. It never reaches
   * the ordinary sign-in endpoint: it is verified on its own (R3.5), and the
   * sign-in that follows carries no code at all.
   */
  recoveryPhoneCode?: string
  oauthRequest: string
}

export enum TypeSignIn {
  'personal',
  'institutional',
  'social',
}
