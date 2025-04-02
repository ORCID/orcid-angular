import { readFileSync } from 'fs'
import { join } from 'path'

const newRelicScript = readFileSync(
  join(__dirname, 'new-relic.runtime.js'),
  'utf8'
)

export function newRelic(indexHtml: string) {
  return indexHtml.replace(
    '<!-- NEW_RELIC_PLACEHOLDER -->',
    `<script type="text/javascript">
` +
      newRelicScript +
      `</script>`
  )
}
