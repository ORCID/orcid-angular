export interface AccountTrustedOrganization {
  orcidUri: string
  orcidPath: string
  orcidHost: string
  name: string
  groupOrcidUri?: any
  groupOrcidPath: string
  groupOrcidHost?: any
  groupName: string
  websiteValue: string
  approvalDate: number
  scopePaths: { [key: string]: string }
  tokenId: string
}
