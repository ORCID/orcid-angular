const getRepoInfo = require('git-repo-info')

export function buildInfo(indexHtml, options): string {
  let gitInfo
  try {
    gitInfo = getRepoInfo()
  } catch (err) {}

  const config = `
<!--${options.languageCode} ''
  } ${new Date().toJSON()}-->
${
  gitInfo ? '<!--' + gitInfo.abbreviatedSha + '/' + gitInfo.lastTag + '-->' : ''
}
`
  return indexHtml + config
}
