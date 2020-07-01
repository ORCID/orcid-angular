import { SourceOrcid } from './common.endpoint'

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
  notificationType:
    | 'AMENDED'
    | 'ADMINISTRATIVE'
    | 'CUSTOM'
    | 'SERVICE_ANNOUNCEMENT'
    | 'TIP'
    | 'INSTITUTIONAL_CONNECTION'
    | 'PERMISSION'
  putCode: number
  createdDate: any
  sentDate?: any
  readDate: number
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
}

export interface InboxNotificationPermission extends InboxNotification {
  notificationType: 'PERMISSION'
  authorizationUrl: SourceOrcid
  items: Items
  actionedDate?: any
  notificationSubject: string
  notificationIntro: string
}
