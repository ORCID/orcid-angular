import { SourceOrcid, Value } from './common.endpoint'

interface ExternalIdentifier {
  type: string
  value: string
  url: Value
  relationship: string
}

export interface ExternalIdentifiers {
  externalIdentifier: ExternalIdentifier[]
}

export interface SourceName {
  content: string
}

export interface Source {
  sourceOrcid?: any
  sourceClientId: SourceOrcid
  sourceName: SourceName
  assertionOriginOrcid?: any
  assertionOriginClientId?: any
  assertionOriginName?: any
}

export interface AdditionalInfo {
  department?: string
  org_name?: string
  subject_container_name?: string
  group_name?: string
  external_identifiers?: ExternalIdentifiers
}

export interface Item {
  putCode?: any
  itemType: string
  itemName: string
  externalIdentifier?: any
  actionType: string
  additionalInfo: AdditionalInfo
}

export interface Items {
  items: Item[]
}

export interface InboxNotification {
  notificationType: notificationType
  putCode: number
  createdDate: any
  sentDate?: any
  readDate?: number
  archivedDate?: number
  sourceDescription?: any
  encryptedPutCode?: any
  subject: string
  source: Source
}

export interface InboxNotificationAmended extends InboxNotification {
  notificationType: 'AMENDED'
  items: Items
  amendedSection?:
    | 'AFFILIATION'
    | 'BIO'
    | 'EDUCATION'
    | 'EMPLOYMENT'
    | 'EXTERNAL_IDENTIFIERS'
    | 'FUNDING'
    | 'PEER_REVIEW'
    | 'PREFERENCES'
    | 'UNKNOWN'
    | 'RESEARCH_RESOURCE'
    | 'WORK'
    | 'INVITED_POSITION'
}

export interface InboxNotificationHtml extends InboxNotification {
  notificationType: 'ADMINISTRATIVE' | 'CUSTOM' | 'SERVICE_ANNOUNCEMENT' | 'TIP'
  bodyText: string
  bodyHtml: string
  archivedDate: number
  lang?: any
  overwrittenSourceName?: any
}

export interface InboxNotificationInstitutional extends InboxNotification {
  notificationType: 'INSTITUTIONAL_CONNECTION'
  idpName: any // ????
  actionedDate?: any
  authenticationProviderId
  authorizationUrl: SourceOrcid
}

export interface InboxNotificationPermission extends InboxNotification {
  notificationType: 'PERMISSION'
  authorizationUrl: SourceOrcid
  items: Items
  actionedDate?: any
  notificationSubject: string
  notificationIntro: string
}

export type notificationType =
  | 'AMENDED'
  | 'ADMINISTRATIVE'
  | 'CUSTOM'
  | 'SERVICE_ANNOUNCEMENT'
  | 'TIP'
  | 'INSTITUTIONAL_CONNECTION'
  | 'PERMISSION'

export interface TotalNotificationCount {
  all: number
  nonArchived: number
}
