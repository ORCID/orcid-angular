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
export const ORCID_REGEXP = /(\d{4}-){3,}\d{3}[\dX]$/i
