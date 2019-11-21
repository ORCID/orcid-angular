const SUPPORTED_LANGUAGES = [
  'en',
  'ar',
  'cs',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'pt',
  'ru',
  'zh-CN',
  'zh-TW',
  'xx',
  'source',
  'lr',
  'rl',
  'uk',
  'ca',
]
export function uniqueLength(indexHtml, options): string {
  const configurationLanguage = options.languageCode
  const languageUniqueLength = getLanguageUniqueLength(configurationLanguage)
  indexHtml += `<!--${'!'.repeat(languageUniqueLength)}-->`
  return indexHtml
}

function getLanguageUniqueLength(configurationLanguage) {
  if (SUPPORTED_LANGUAGES.indexOf(configurationLanguage) != -1) {
    return SUPPORTED_LANGUAGES.indexOf(configurationLanguage)
  } else {
    console.warn(
      `The language code "${configurationLanguage}" is not listed on the Angular unique.index.length.post-build 
script, this might produce cache issues`
    )
    return Math.floor(Math.random() * 300) + SUPPORTED_LANGUAGES.length
  }
}
