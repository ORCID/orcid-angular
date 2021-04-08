import { Params } from '@angular/router'

export interface PlatformInfo {
  rtl: boolean
  ltr: boolean
  screenDirection: 'rtl' | 'ltr'
  unsupportedBrowser: boolean
  desktop: boolean
  tabletOrHandset: boolean
  tablet: boolean
  handset: boolean
  edge: boolean
  ie: boolean
  safary: boolean
  firefox: boolean
  columns4: boolean
  columns8: boolean
  columns12: boolean
  hasOauthParameters: boolean //  Simple check true if the url has client_id or redirect_uri or response_type parameters
  social: boolean
  institutional: boolean
  queryParameters: Params
  currentRoute: string
  reactivation: boolean
  reactivationCode: string
}
