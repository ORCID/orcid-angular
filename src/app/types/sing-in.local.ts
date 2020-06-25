export interface SingInLocal {
  data: FormSignIn
  type: TypeSignIn
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
}
