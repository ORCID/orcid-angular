export interface SocialAccount {
  dateCreated: number
  lastModified: number
  id: SocialAccountId
  accesstoken: string
  displayname: string
  email: string
  expiretime: number
  imageurl?: string
  lastLogin: number
  orcid: string
  profileurl?: string
  rank: number
  refreshtoken?: string
  secret?: string
  idType?: string
  headersJson?: string
  connectionSatus: string
  accountIdForDisplay: string
  linked: boolean
  idpName?: string // Computed on the frontend
}
export interface SocialAccountId {
  userid: string
  providerid: ProviderIds
  provideruserid: string
}

export interface SocialAccountDeleteResponse {
  errors?: any[]
  password?: string
  idToManage: SocialAccountId
}

enum ProviderIds {
  facebook = 'facebook',
  google = 'google',
}
