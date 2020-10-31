// Get current central time hyphen separated date
/// <reference types="cypress" />

module.exports = (expected) => {
  return Cypress.sinon.match((value) => {
    if (value && expected && value.indexOf('?') >= 0) {
      const Path1 = value.split('?')[0]
      const Path2 = expected.split('?')[0]
      const urlParams1 = urlToParams(value)
      const urlParams2 = urlToParams(expected)
      const matcher = Cypress.sinon.match(urlParams2)
      return matcher.test(urlParams1) && Path1 === Path2
    } else if (value && expected) {
      return expected === value
    } else {
      return false
    }
  }, expected)
}

function urlToParams(url) {
  let urlParams = {}
  let searchParams = new URLSearchParams(url.split('?')[1])
  searchParams.forEach((x, y) => (urlParams[y] = x))
  urlParams.scope = urlParams.scope.split(' ').sort()
  urlParams.oauth = ''
  return urlParams
}
