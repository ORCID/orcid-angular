module.exports = function (parameters) {
  return '?' + objectToUrlParameters(parameters)
}

// TODO this is been duplicated from the constant file on orcid.angular
// once cypress is migrated to TS thi can be removed
function objectToUrlParameters(object) {
  return Object.keys(object)
    .map((key) =>
      object[key] !== undefined
        ? `${key}=${encodeURIComponent(object[key])}`
        : null
    )
    .join('&')
}
