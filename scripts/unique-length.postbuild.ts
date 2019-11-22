export function uniqueLength(indexHtml, options): string {
  const configurationLanguage = options.languageCode
  const languageUniqueLength = getLanguageUniqueLength(
    configurationLanguage,
    options
  )
  indexHtml += `<!--${'!'.repeat(languageUniqueLength)}-->`
  return indexHtml
}

function getLanguageUniqueLength(configurationLanguage, options) {
  let supportedLanguage
  if (options.environmentVariables) {
    supportedLanguage = Object.keys(
      options.environmentVariables.LANGUAGE_MENU_OPTIONS
    )
  }
  if (
    supportedLanguage &&
    supportedLanguage.indexOf(configurationLanguage) !== -1
  ) {
    return supportedLanguage.indexOf(configurationLanguage)
  } else {
    console.warn(
      `The language code "${configurationLanguage}" is not listed on the Angular environment`
    )
    console.warn(`this language will not be shown on the menu`)
    return Math.floor(Math.random() * 300) + supportedLanguage
      ? supportedLanguage.length
      : 0
  }
}
