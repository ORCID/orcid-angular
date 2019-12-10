/*
The goal of this script is to add different comment lengths on the index.html files of each language.
The reason for doing this is to have different eTag HTTP response headers for each.
This works since Nginx generates etags based on the file lengths.
Different etags are required for each language since browsers use this to know whether it can reuse the
cached app (304 response) or a new app with a different language should be downloaded (200 response).

Know issues with Cloudflare.

1- If HTML minimization is activated this will remove comments on the "index.html" and different languages
will have the same eTag. Also, the Nginx security feature of adding a random length HTML comment will be removed.
Because of that, this minification should be avoided.

2-  As described on the official docs to enable weak etags the features "Email Obfuscation" and
"Automatic HTTPS Rewrites" must be disabled.
https://support.cloudflare.com/hc/en-us/articles/218505467-Using-ETag-Headers-with-Cloudflare 
*/
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
