var fs = require('fs')
module.exports = (targetOptions, indexHtml) => {
  if (targetOptions && targetOptions.target === 'build') {
    assetsToPrefetch = [/NotoSans-ExtraBold.*\.woff2/]
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
  let assetLinks = ''
  assetsNames.forEach(asset => {
    const assetLink = `<link rel="prefetch" href="${asset}" />`
    assetLinks += assetLink
  })

  const i = indexHtml.indexOf('</head>')
  return `${indexHtml.slice(0, i)}
  ${assetLinks}
  ${indexHtml.slice(i)}`
}
