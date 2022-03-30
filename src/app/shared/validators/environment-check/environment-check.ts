export function isQA(window) {
  //TODO SSR
  if (window.location) {
    return window.location.hostname.startsWith('qa.orcid.org')
  }
}
