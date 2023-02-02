import { Address, MonthDayYearDate } from './types'
import { UrlMatchResult, UrlSegment } from '@angular/router'
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormArray,
} from '@angular/forms'
import { ComponentType } from '@angular/cdk/portal'
import { ModalEmailComponent } from './cdk/side-bar/modals/modal-email/modal-email.component'
import { ModalAffiliationsComponent } from './record/components/affiliation-stacks-groups/modals/modal-affiliations/modal-affiliations.component'
import { ModalNameComponent } from './record/components/top-bar/modals/modal-name/modal-name.component'
import { ModalFundingComponent } from './record/components/funding-stacks-groups/modals/modal-funding/modal-funding.component'
import { ModalFundingSearchLinkComponent } from './record/components/funding-stacks-groups/modals/modal-funding-search-link/modal-funding-search-link.component'
import { ModalWorksSearchLinkComponent } from './record/components/work-stack-group/modals/work-search-link-modal/modal-works-search-link.component'
import { WorkModalComponent } from './record/components/work-modal/work-modal.component'
import { ModalPeerReviewsComponent } from './record/components/peer-review-stacks-groups/modals/modal-peer-reviews/modal-peer-reviews.component'
import { WorkExternalIdModalComponent } from './record/components/work-stack-group/modals/work-external-id-modal/work-external-id-modal.component'
import { ModalBiographyComponent } from './record/components/top-bar/modals/modal-biography/modal-biography.component'
import { ModalCountryComponent } from './cdk/side-bar/modals/modal-country/modal-country.component'
import { ModalKeywordComponent } from './cdk/side-bar/modals/modal-keyword/modal-keyword.component'
import { ModalWebsitesComponent } from './cdk/side-bar/modals/modal-websites/modal-websites.component'
import { ModalPersonIdentifiersComponent } from './cdk/side-bar/modals/modal-person-identifiers/modal-person-identifiers.component'
import { AffiliationType } from './types/record-affiliation.endpoint'
import { WorkBibtexModalComponent } from './record/components/work-stack-group/modals/work-bibtex-modal/work-bibtex-modal.component'

export { COUNTRY_NAMES_TO_COUNTRY_CODES } from './constants-country-codes'

// Custom email REGEXP
// https://regex101.com/r/jV4aN7/16
// tslint:disable-next-line: max-line-length
export const EMAIL_REGEXP =
  /^([^@\s]|(".+"))+@([^@\s\."'\(\)\[\]\{\}\\/,:;]+\.)+([^@\s\."'\(\)\[\]\{\}\\/,:;]{2,})+$/

export const EMAIL_REGEXP_GENERIC = /^\s*?(.+)@(.+?)\s*$/
// https://regex101.com/r/9MXmdl/1
export const ORCID_REGEXP = /(\d{4}[- ]{0,}){3}\d{3}[\dX]$/
export const ORCID_REGEXP_CASE_INSENSITIVE = /(\d{4}[- ]{0,}){3}\d{3}[\dX]$/i
// https://regex101.com/r/V95col/6
// tslint:disable-next-line: max-line-length
export const ORCID_URI_REGEXP =
  /(orcid\.org\/|qa\.orcid\.org\/|sandbox\.orcid\.org\/|dev\.orcid\.org\/|localhost.*)(\d{4}[- ]{0,}){3}\d{3}[\dX]$/i
/* NO PROTOCOL REQUIRED*/
// https://regex101.com/r/M1fqZi/1
export const URL_REGEXP =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#%[\]@!\$&'\(\)\*\+\\,;=.>< ]+$/i
/* PROTOCOL REQUIRED*/
// https://regex101.com/r/pSnDC7/1
export const URL_REGEXP_BACKEND =
  /^((https?):\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#%[\]@!\$&'\(\)\*\+\\,;=.>< ]+$/i
// https://www.regextester.com/96577
export const ILLEGAL_NAME_CHARACTERS_REGEXP = /([@\$!])/
// https://regex101.com/r/aoHxNo/1
export const HAS_NUMBER = /(?=.*[0-9]).*/
// https://regex101.com/r/NNIuKQ/1
export const HAS_LETTER_OR_SYMBOL = /(?=.*[^\d\s]).*/
// https://regex101.com/r/gznzc6/1 strips params for OJS links
export const REDIRECT_URI_REGEXP =
  /(?=redirect_uri=)(.*?)(?=orcidapi)|(?=redirect_uri=)(.*?)$/
//https://regex101.com/r/yjxqUa/1
export const AMOUNT_FORMATTED_WITH_DECIMAL_REGEXP =
  /^(\d+(\.\d{1,2})?|\.?\d{1,2})$/
//https://regex101.com/r/pIQDel/1
export const AMOUNT_FULLY_FORMATTED_REGEX =
  /(?=.*\d)^(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/
//https://regex101.com/r/EAlANV/1
export const AMOUNT_DIGITS_ONLY_REGEX = /^\d+$/
// https://regex101.com/r/XvbCrA/1
export const WHITE_SPACE_REGEXP = /\s+/g

export const ITEM_ACTION_EDIT = 'edit'
export const ITEM_ACTION_DELETE = 'delete'
export const ITEM_ACTION_HIDE = 'hide'
export const ITEM_ACTION_SHOW = 'show'
export const ITEM_ACTION_SELECT = 'select'
export const ITEM_ACTION_EXPAND = 'expand'
export const ITEM_ACTION_COLLAPSE = 'collapse'

export const ApplicationRoutes = {
  myOrcid: 'my-orcid',
  twoFactor: '2fa-signin',
  twoFactorSetup: '2FA/setup',
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
  account: 'account',
  trustedParties: 'trusted-parties',
  resetPasswordEmail: 'reset-password-email',
  selfService: 'self-service',
  home: '',
}

export const HeadlessOnOauthRoutes = [
  ApplicationRoutes.twoFactor,
  ApplicationRoutes.twoFactorSetup,
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
  const orcidPattern = ORCID_REGEXP_CASE_INSENSITIVE
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

export enum EXTERNAL_ID_TYPE_WORK {
  doi,
  pubMed,
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
export const MAX_LENGTH_LESS_THAN_ONE_HUNDRED = 99
export const MAX_LENGTH_LESS_THAN_ONE_THOUSAND = 999
export const MAX_LENGTH_LESS_THAN_FIVE_THOUSAND = 4999
export const MAX_LENGTH_LESS_THAN_TWO_THOUSAND = 1999
export const MAX_LENGTH_LESS_THAN_TWO_HUNDRED_FIFTY_FIVE = 254
export const MAX_LENGTH_LESS_THAN_TWO_THOUSAND_EIGHTY_FOUR = 2083

export function GetFormErrors(form: AbstractControl) {
  if (form instanceof UntypedFormControl) {
    return form.errors ?? null
  }
  if (form instanceof UntypedFormGroup) {
    const groupErrors = form.errors
    const formErrors = groupErrors ? { groupErrors } : {}
    Object.keys(form.controls).forEach((key) => {
      const error = GetFormErrors(form.get(key))
      if (error instanceof Array) {
        error.forEach((e) => {
          if (e !== null) {
            formErrors[key] = error
            return
          }
        })
      } else if (error !== null) {
        formErrors[key] = error
      }
    })
    return Object.keys(formErrors).length > 0 ? formErrors : null
  }
  if (form instanceof UntypedFormArray) {
    const groupErrors = form.errors
    const formErrors = groupErrors ? [groupErrors] : []
    form.controls.forEach((control) => {
      const error = GetFormErrors(control)
      formErrors.push(error)
    })
    return formErrors.length > 0 ? formErrors : null
  }
}

export function getAriaLabel(
  component: ComponentType<any>,
  type?: string | AffiliationType | EXTERNAL_ID_TYPE_WORK
): string {
  switch (component) {
    case ModalAffiliationsComponent:
      switch (type) {
        case 'employment':
          return $localize`:@@shared.dialogAriaLabeledByEmployment:Manage employment dialog`
        case 'education':
          return $localize`:@@shared.dialogAriaLabeledByEducation:Manage education dialog`
        case 'qualification':
          return $localize`:@@shared.dialogAriaLabeledByQualification:Manage qualification dialog`
        case 'distinction':
          return $localize`:@@shared.dialogAriaLabeledByDistinction:Manage distinction dialog`
        case 'invited-position':
          return $localize`:@@shared.dialogAriaLabeledByInvitedPosition:Manage invited position dialog`
        case 'membership':
          return $localize`:@@shared.dialogAriaLabeledByMembership:Manage membership dialog`
        case 'service':
          return $localize`:@@shared.dialogAriaLabeledByService:Manage service dialog`
      }
    case WorkBibtexModalComponent:
      return $localize`:@@shared.dialogAriaLabeledByBibtex:Manage bibtex dialog`
    case WorkExternalIdModalComponent:
      return $localize`:@@shared.dialogAriaLabeledByExternalIdentifier:Manage external identifier dialog`
    case ModalNameComponent:
      return $localize`:@@shared.dialogAriaLabeledByNames:Manage your names dialog`
    case ModalBiographyComponent:
      return $localize`:@@shared.dialogAriaLabeledByBiography:Manage your biography dialog`
    case ModalEmailComponent:
      return $localize`:@@shared.dialogAriaLabeledByEmails:Manage your emails dialog`
    case ModalCountryComponent:
      return $localize`:@@shared.dialogAriaLabeledByCountries:Manage your countries dialog`
    case ModalKeywordComponent:
      return $localize`:@@shared.dialogAriaLabeledByKeywords:Manage your keywords dialog`
    case ModalPersonIdentifiersComponent:
      return $localize`:@@shared.dialogAriaLabeledByOtherIds:Manage your other IDs dialog`
    case ModalWebsitesComponent:
      return $localize`:@@shared.dialogAriaLabeledByWebsites:Manage your websites & social links dialog`
    case ModalFundingComponent:
      return $localize`:@@shared.dialogAriaLabeledByFunding:Manage funding dialog`
    case ModalFundingSearchLinkComponent:
      return $localize`:@@shared.dialogAriaLabeledByFundingSearch:Manage funding search dialog`
    case WorkModalComponent:
      return $localize`:@@shared.dialogAriaLabeledByWork:Manage work dialog`
    case ModalWorksSearchLinkComponent:
      return $localize`:@@shared.dialogAriaLabeledByWorkSearch:Manage work search dialog`
    case ModalPeerReviewsComponent:
      return $localize`:@@shared.dialogAriaLabeledByPeerReview:Manage peer review dialog`
  }
}
