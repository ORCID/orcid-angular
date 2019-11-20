var uniqueLength = require('./unique.index.length.post-build')

module.exports = (targetOptions, indexHtml) => {
  if (targetOptions && targetOptions.target === 'build') {
    indexHtml = uniqueLength(targetOptions, indexHtml)
    return indexHtml
  } else {
    return indexHtml
  }
}
