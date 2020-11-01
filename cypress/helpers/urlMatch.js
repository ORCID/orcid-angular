// Get current central time hyphen separated date
/// <reference types="cypress" />

module.exports = (expected) => {
  return Cypress.sinon.match((value) => {
    if (typeof expected === 'object') {
      const urlParams1 = urlToParams(value)
      const Path1 = value.split('?')[0]
      const matcher = Cypress.sinon.match(expected.urlParameters)
      const sameAmountOfKeys =
        Object.keys(expected.urlParameters).length ===
        Object.keys(urlParams1).length
      // console.log('_________')
      // console.log (Path1)
      // console.log (expected.url)
      // console.log(urlParams1)
      // console.log(expected)
      return (
        matcher.test(urlParams1) && Path1 === expected.url && sameAmountOfKeys
      )
    } else if (value && expected && value.indexOf('?') >= 0) {
      const Path1 = value.split('?')[0]
      const Path2 = expected.split('?')[0]
      const urlParams1 = urlToParams(value)
      const urlParams2 = urlToParams(expected)
      const matcher = Cypress.sinon.match(urlParams2)
      const sameAmountOfKeys =
        Object.keys(urlParams1).length === Object.keys(urlParams2).length
      console.log(urlParams1, urlParams2)
      // console.log('_________')
      // console.log (Path1)
      // console.log (Path2)
      // console.log(urlParams1)
      // console.log(urlParams2)

      return matcher.test(urlParams1) && Path1 === Path2 && sameAmountOfKeys
    } else if (value && expected) {
      return expected === value
    } else {
      return false
    }
  }, JSON.stringify(expected))
}

function urlToParams(url) {
  let urlParams = {}
  let searchParams = new URLSearchParams(url.split('?')[1])
  searchParams.forEach((x, y) => (urlParams[y] = x))
  if (urlParams.scope) {
    urlParams.scope = urlParams.scope.split(' ').sort()
  }
  return urlParams
}

function matchObject(expected) {
  return Cypress.sinon.match((value) => {})
}
