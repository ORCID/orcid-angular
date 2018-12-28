export function isValidOrcidFormat(id) {
  const regExp = new RegExp('([0-9]{4}-){3}[0-9]{4}')
  return id && regExp.test(id)
}

export const URL_PRIVATE_PROFILE = 'myorcid'
