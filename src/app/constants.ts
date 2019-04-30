export function isValidOrcidFormat(id) {
  const regExp = new RegExp('([0-9]{4}-){3}[0-9]{4}')
  return id && regExp.test(id)
}

export const URL_PRIVATE_PROFILE = 'myorcid'

// LAYOUT DEFINITIONS

export const GRID_GUTTER = {
  desktop: '12',
  tablet: '8',
  handset: '4',
}

export const GRID_MARGINS = {
  desktop: '24',
  tablet: '16',
  handset: '16',
}

export const GRID_COLUMNS = {
  desktop: '12',
  tablet: '8',
  handset: '4',
}
