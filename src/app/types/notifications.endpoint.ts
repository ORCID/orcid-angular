import {
  SourceOrcid,
  SourceWithAssertionOrigin,
  Value,
} from './common.endpoint'

interface ExternalIdentifier {
  type: string
  value: string
  url: Value
  relationship: string
}

export interface ExternalIdentifiers {
  externalIdentifier: ExternalIdentifier[]
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
  source: SourceWithAssertionOrigin
}

export interface InboxNotificationAmended extends InboxNotification {
  notificationType: 'AMENDED'
  items: Items
  amendedSection?:
    | 'AFFILIATION'
    | 'BIO'
    | 'DISTINCTION'
    | 'EDUCATION'
    | 'EMPLOYMENT'
    | 'EXTERNAL_IDENTIFIERS'
    | 'FUNDING'
    | 'INVITED_POSITION'
    | 'MEMBERSHIP'
    | 'PEER_REVIEW'
    | 'PREFERENCES'
    | 'QUALIFICATION'
    | 'SERVICE'
    | 'RESEARCH_RESOURCE'
    | 'UNKNOWN'
    | 'WORK'
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

export type InboxNotificationItem =
  | InboxNotificationAmended
  | InboxNotificationHtml
  | InboxNotificationInstitutional
  | InboxNotificationPermission

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
  archived?: number
}
