import { Address, MonthDayYearDate } from './types'
import { UrlMatchResult, UrlSegment } from '@angular/router'

export { COUNTRY_NAMES_TO_COUNTRY_CODES } from './constants-country-codes'

// Custom email REGEXP
// https://regex101.com/r/jV4aN7/16
// tslint:disable-next-line: max-line-length
export const EMAIL_REGEXP = /^([^@\s]|(".+"))+@([^@\s\."'\(\)\[\]\{\}\\/,:;]+\.)+([^@\s\."'\(\)\[\]\{\}\\/,:;]{2,})+$/

export const EMAIL_REGEXP_GENERIC = /^\s*?(.+)@(.+?)\s*$/
// https://regex101.com/r/9MXmdl/1
export const ORCID_REGEXP = /(\d{4}[- ]{0,}){3}\d{3}[\dX]$/i
// https://regex101.com/r/V95col/6
// tslint:disable-next-line: max-line-length
export const ORCID_URI_REGEXP = /(orcid\.org\/|qa\.orcid\.org\/|sandbox\.orcid\.org\/|dev\.orcid\.org\/|localhost.*)(\d{4}[- ]{0,}){3}\d{3}[\dX]$/i
// https://regex101.com/r/elR7iL/1
export const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+\\,;=.]+$/
// https://regex101.com/r/GEaSMo/2
export const URL_REGEXP_BACKEND = /^(((https?):\/\/)(%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)([).!';/?:,][[:blank:]])?$/
// https://www.regextester.com/96577
export const ILLEGAL_NAME_CHARACTERS_REGEXP = /([@\$!])/
// https://regex101.com/r/aoHxNo/1
export const HAS_NUMBER = /(?=.*[0-9]).*/
// https://regex101.com/r/NNIuKQ/1
export const HAS_LETTER_OR_SYMBOL = /(?=.*[^\d\s]).*/
// https://regex101.com/r/gznzc6/1 strips params for OJS links
export const REDIRECT_URI_REGEXP = /(?=redirect_uri=)(.*?)(?=orcidapi)|(?=redirect_uri=)(.*?)$/

export const ApplicationRoutes = {
  myOrcid: 'my-orcid',
  myOrcidTEMP: 'qa/my-orcid',
  twoFactor: '2fa-signin',
  institutionalLinking: 'institutional-linking',
  social: 'social-linking',
  institutional: 'institutional-signin',
  inbox: 'inbox',
  login: 'login',
  signin: 'signin',
  authorize: 'oauth/authorize',
  search: 'orcid-search/search',
  reactivation: 'reactivation',
  resetPassword: 'reset-password',
  register: 'register',
  thirdPartySignIn: 'third-party-signin-completed',
  home: '',
}

export const HeadlessOnOauthRoutes = [
  ApplicationRoutes.twoFactor,
  ApplicationRoutes.social,
  ApplicationRoutes.institutionalLinking,
  ApplicationRoutes.institutional,
  ApplicationRoutes.login,
  ApplicationRoutes.signin,
  ApplicationRoutes.authorize,
  ApplicationRoutes.resetPassword,
  ApplicationRoutes.register,
]

export const PerformanceMarks = {
  navigationStartPrefix: 'start_',
  navigationEndPrefix: 'ends_',
}

export function isValidOrcidFormat(id) {
  return id && ORCID_REGEXP.test(id)
}

export function getOrcidNumber(userId) {
  const orcidPattern = ORCID_REGEXP
  const extId = orcidPattern.exec(userId)
  if (extId != null) {
    userId = extId[0].toString().replace(/ /g, '')
    userId = userId.toString().replace(/-/g, '')
    const temp = userId.toString().replace(/(.{4})/g, '$1-')
    const length = temp.length
    userId = temp.substring(0, length - 1).toUpperCase()
  }
  return userId
}

export const URL_PRIVATE_PROFILE = 'myorcid'

// LAYOUT DEFINITIONS

export const GRID_GUTTER = {
  desktop: 12,
  tablet: 8,
  handset: 4,
}

export const GRID_MARGINS = {
  desktop: 200,
  tablet: 16,
  handset: 16,
}

export const GRID_COLUMNS = {
  desktop: 12,
  tablet: 8,
  handset: 4,
}

export enum ADD_EVENT_ACTION {
  addManually,
  doi,
  searchAndLink,
  pubMed,
  bibText,
}

export const VISIBILITY_OPTIONS = ['PUBLIC', 'LIMITED', 'PRIVATE']

export const AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL = 10

export function isRedirectToTheAuthorizationPage(data: { url: string }) {
  return data.url.toLowerCase().includes('oauth/authorize')
}

export function objectToUrlParameters(object: Object) {
  return Object.keys(object)
    .map((key) => `${key}=${encodeURIComponent(object[key])}`)
    .join('&')
}

export function routerPublicPageUrl(segments: UrlSegment[]) {
  if (segments[0] && isValidOrcidFormat(segments[0].path)) {
    return { consumed: [segments[0]] }
  }
  if (segments[1] && isValidOrcidFormat(segments[1].path)) {
    return { consumed: [segments[0], segments[1]] }
  }
  return {
    consumed: [],
  }
}

export function routerReactivation(segments: UrlSegment[]): UrlMatchResult {
  if (
    segments[0] &&
    segments[0].path.match(new RegExp(ApplicationRoutes.reactivation, 'g'))
  ) {
    return { consumed: segments }
  }
}

export function routerThirdPartySignInMatch(
  segments: UrlSegment[]
): UrlMatchResult {
  if (
    (segments[1] &&
      segments[1].path.match(
        new RegExp(ApplicationRoutes.thirdPartySignIn, 'g')
      )) ||
    (segments[2] &&
      segments[2].path.match(
        new RegExp(ApplicationRoutes.thirdPartySignIn, 'g')
      ))
  ) {
    return { consumed: segments }
  }
}

export function getDate(address: Address) {
  const x = address.createdDate
  let date: Date
  if (x.year && x.month && x.day) {
    date = new Date(
      Date.UTC(
        Number.parseInt(x.year, 10),
        Number.parseInt(x.month, 10),
        Number.parseInt(x.day, 10)
      )
    )
  }
  return date
}

export function DateToMonthDayYearDateAdapter(
  value: number
): MonthDayYearDate | undefined {
  if (value) {
    const date = new Date(value)
    return {
      month: date.getMonth().toString(),
      day: date.getDay().toString(),
      year: date.getFullYear().toString(),
    }
  } else {
    return undefined
  }
}

export function ArrayFlat(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? ArrayFlat(toFlatten) : toFlatten
    )
  }, [])
}

export const DEFAULT_PAGE_SIZE = 50
