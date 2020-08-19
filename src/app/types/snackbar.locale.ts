import { ScreenDirection } from './screen-directions.local'

export interface DisplayMessage {
  title: string
  message?: string
  action?: string
  actionURL?: string
  contentDirection?: ScreenDirection
  closable?: boolean
  displayOnlyOnVerboseEnvironment?: boolean
}

export interface ErrorAnalyticsReport {
  code: string
  fatal: boolean
}

export interface ErrorReport {
  display?: DisplayMessage
  analytics?: ErrorAnalyticsReport
}
