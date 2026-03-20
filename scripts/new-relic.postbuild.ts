import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const newRelicSourcePath = join(__dirname, 'new-relic.runtime.js')

let minifiedNewRelicJs: string | undefined

function getMinifiedNewRelicJs(): string {
  if (minifiedNewRelicJs !== undefined) {
    return minifiedNewRelicJs
  }
  const { minify_sync } = require('terser') as {
    minify_sync: (
      code: string,
      options?: Record<string, unknown>
    ) => { code?: string; error?: Error }
  }
  const source = readFileSync(newRelicSourcePath, 'utf8')
  const result = minify_sync(source, {
    compress: true,
    mangle: true,
    format: { comments: false },
  })
  if (result.error) {
    throw result.error
  }
  if (!result.code) {
    throw new Error('terser returned empty code for new-relic.runtime.js')
  }
  minifiedNewRelicJs = result.code
  return minifiedNewRelicJs
}

export function newRelic(
  indexHtml: string,
  options: { folder: string; languageCode: string }
) {
  writeFileSync(
    join(options.folder, 'new-relic.runtime.js'),
    getMinifiedNewRelicJs(),
    'utf8'
  )
  const src = `new-relic.runtime-${options.languageCode}.js`
  return indexHtml.replace(
    '<!-- NEW_RELIC_PLACEHOLDER -->',
    `<script type="text/javascript" src="${src}"></script>`
  )
}
