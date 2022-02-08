export interface SocialAccount {
  dateCreated: number
  lastModified: number
  id: SocialAccountId
  accesstoken: string
  displayname: string
  email: string
  expiretime: number
  imageurl?: null
  lastLogin: number
  orcid: string
  profileurl?: null
  rank: number
  refreshtoken?: null
  secret?: null
  idType?: null
  headersJson?: null
  connectionSatus: string
  accountIdForDisplay: string
  linked: boolean
}
export interface SocialAccountId {
  userid: string
  providerid: string
  provideruserid: string
}

export interface SocialAccountDeleteResponse {
  errors?: null[] | null
  password?: null
  idToManage: SocialAccountId
}
