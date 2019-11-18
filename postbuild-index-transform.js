var fs = require('fs')
module.exports = (targetOptions, indexHtml) => {
  if (targetOptions && targetOptions.target === 'build') {
    assetsToPrefetch = [
      /MaterialIcons-Regular.*\.woff2/,
      /NotoSans-Bold.*\.woff2/,
      /NotoSans-Light.*\.woff2/,
      /NotoSans-Medium.*\.woff2/,
      /NotoSans-Regular.*\.woff2/,
      /orcid.logo.background.*\.svg/,
    ]
    configurationLanguage = getConfLanguage(targetOptions)
    return getAssetsToPrefetch(assetsToPrefetch, configurationLanguage).then(
      assetsNames => {
        return appendAssetsToTheIndex(assetsNames, indexHtml)
      }
    )
  } else {
    return indexHtml
  }
}

// http://localhost:4200/en/assets/icons/public-domain.png
// http://localhost:4200/en/assets/img/organizations.jpg
// http://localhost:4200/en/assets/vectors/glyphicons-social-22-github.svg
// http://localhost:4200/en/assets/vectors/glyphicons-social-32-twitter.svg
// http://localhost:4200/en/assets/vectors/glyphicons-social-38-rss.svg
// http://localhost:4200/en/assets/vectors/orcid.logo.icon.svg
// http://localhost:4200/en/assets/vectors/orcid.logo.svg

function getAssetsToPrefetch(assetsToPrefetch, configurationLanguage) {
  return new Promise((resolve, reject) => {
    fs.readdir('./dist' + '/' + configurationLanguage, (err, items) => {
      if (!err) {
        var assetsNames = []
        items.forEach(item => {
          assetsToPrefetch.forEach(regExp => {
            if (regExp.test(item)) {
              assetsNames.push(item)
            }
          })
        })
        resolve(assetsNames)
      } else {
        reject(err)
      }
    })
  })
}

function getConfLanguage(targetOptions) {
  if (targetOptions.configuration) {
    return targetOptions.configuration.split('-')[1]
  }
}

function appendAssetsToTheIndex(assetsNames, indexHtml) {
  console.log(JSON.stringify(assetsNames))
  let assetLinks = ''
  assetsNames.forEach(asset => {
    const assetLink = `<link rel="preload" href="${asset}" as="font"/>`
    assetLinks += assetLink
  })

  const i = indexHtml.indexOf('</head>')
  return `${indexHtml.slice(0, i)}
  ${assetLinks}
  ${indexHtml.slice(i)}`
}
