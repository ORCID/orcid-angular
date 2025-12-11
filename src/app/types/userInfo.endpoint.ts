export interface UserInfo {
  EFFECTIVE_USER_ORCID: string
  PRIMARY_EMAIL: string
  PRIMARY_RECORD?: string
  IS_DEACTIVATED: string
  IS_LOCKED: string
  DEVELOPER_TOOLS_ENABLED: string
  IS_PRIMARY_EMAIL_VERIFIED: string
  LOCKED: string
  CLAIMED: string
  HAS_VERIFIED_EMAIL: string
  REAL_USER_ORCID: string
  IN_DELEGATION_MODE: string
  LAST_MODIFIED: string
  SELF_SERVICE_MENU?: string
  RECORD_WITH_ISSUES: boolean
  USER_NOT_FOUND: boolean
  DELEGATED_BY_ADMIN: 'true' | undefined
  READY_FOR_INDEXING: string
}
