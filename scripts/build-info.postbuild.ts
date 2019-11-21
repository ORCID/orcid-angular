import getRepoInfo = require('git-repo-info')

export function buildInfo(indexHtml, target): string {
  let gitInfo
  try {
    gitInfo = getRepoInfo()
  } catch (err) {}

  const config = `
<!--${target.languageCode}${
    target.environment ? '-' + target.environment : ''
  } ${new Date().toJSON()}-->
${
    gitInfo
      ? '<!--' + gitInfo.abbreviatedSha + '/' + gitInfo.lastTag + '-->'
      : ''
  }
`
  return indexHtml + config
}
