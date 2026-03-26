import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

// fingerprint: orcid-angular/new-relic.postbuild.ts:v1
const newRelicSourcePath = join(__dirname, 'new-relic.runtime.js')

let newRelicCode: string | undefined
let newRelicContentHash: string | undefined

function getNewRelicCode(): string {
  if (newRelicCode !== undefined) {
    return newRelicCode
  }
  newRelicCode = readFileSync(newRelicSourcePath, 'utf8')
  return newRelicCode
}

function getNewRelicContentHash(): string {
  if (newRelicContentHash !== undefined) {
    return newRelicContentHash
  }
  const code = getNewRelicCode()
  newRelicContentHash = createHash('sha256')
    .update(code)
    .digest('hex')
    .slice(0, 16)
  return newRelicContentHash
}

export function newRelic(
  indexHtml: string,
  options: { folder: string; languageCode: string }
) {
  const hash = getNewRelicContentHash()
  writeFileSync(
    join(options.folder, `new-relic.runtime.${hash}.js`),
    getNewRelicCode(),
    'utf8'
  )
  const src = `new-relic.runtime.${hash}-${options.languageCode}.js`
  return indexHtml.replace(
    '<!-- NEW_RELIC_PLACEHOLDER -->',
    `<script type="text/javascript" src="${src}"></script>`
  )
}
