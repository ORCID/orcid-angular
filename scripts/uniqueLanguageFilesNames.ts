export function addLanguageCodeToHashesOnToHTMLFiles(data: string, options) {
  return data.replace(
    // REG EXP to find the angular build files https://regex101.com/r/FgySAf/1 (updated for Angular11-12 update)
    /src="[-a-zA-Z0-9]{4,10}\.[a-z0-9]{16}/g,
    '$&' + '-' + options.languageCode
  )
}

export function addLanguageCodeToHashesOnJSFiles(data, hashList, options) {
  hashList.forEach((oldHash) => {
    data = data.replace(oldHash, oldHash + '-' + options.languageCode)
  })
  return data
}
