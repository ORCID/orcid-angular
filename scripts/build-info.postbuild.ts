import getRepoInfo = require('git-repo-info')

export function buildInfoPostbuild(indexHtml, target): string {
  let gitInfo
  try {
    gitInfo = getRepoInfo()
  } catch (err) {}

  const config = `
<!--${target} ${new Date().toJSON()}-->
${
    gitInfo
      ? '<!--' + gitInfo.abbreviatedSha + '/' + gitInfo.lastTag + '-->'
      : ''
  }
`
  return indexHtml + config
}
