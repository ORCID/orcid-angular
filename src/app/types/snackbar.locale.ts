import { ScreenDirection } from './screen-directions.local'

export interface ErrorDisplay {
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
  display?: ErrorDisplay
  analytics?: ErrorAnalyticsReport
}
