export const ApplicationRoutes = {
  search: 'orcid-search/search',
  resetPassword: 'reset-password',
  register: 'register',
  home: '',
}

export const PerformanceMarks = {
  navigationStartPrefix: 'start_',
  navigationEndPrefix: 'ends_',
}

export function isValidOrcidFormat(id) {
  const regExp = new RegExp('([0-9]{4}-){3}[0-9]{4}')
  return id && regExp.test(id)
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

// On top of Angular email validator that follows RFC rules
// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
// this REGEXP adds the requirement of ending with a TLD as defined on RFC2396
export const TLD_REGEXP = /^.*\.([a-zA-Z\-])([a-zA-Z\-]{0,61})([a-zA-Z\-])$/
// https://regexr.com/51o43
export const ORCID_REGEXP = /(\d{4}-){3,}\d{3}[\dX]$/i
// https://www.regextester.com/94502
export const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
// https://www.regextester.com/96577
export const ILLEGAL_NAME_CHARACTERS_REGEXP = /([^\w\s\-\'\.\,])/
// https://regex101.com/r/aoHxNo/1
export const HAS_NUMBER = /(?=.*[0-9]).*/
// https://regex101.com/r/NNIuKQ/1
export const HAS_LETTER_OR_SYMBOL = /(?=.*[^\d\s]).*/
