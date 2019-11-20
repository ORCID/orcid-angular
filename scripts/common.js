function getConfLanguage(targetOptions) {
  if (targetOptions.configuration) {
    return targetOptions.configuration.split('-')[1].replace('_', '-')
  }
}

module.exports = {
  getConfLanguage: getConfLanguage,
}
