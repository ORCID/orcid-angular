import * as fs from 'fs'

// Using browserslist-useragent-regexp a browserslist REGEXP is generated to be used on the application run time
// This will decide wether show or hide the unsupported browser version banner

// Use dynamic import for ESM module (browserslist-useragent-regexp v4+ is ESM-only)
async function generateBrowserlistRegexp() {
  const { getUserAgentRegex } = await import('browserslist-useragent-regexp')

  const regExp = getUserAgentRegex({
    allowHigherVersions: true,
    allowZeroSubversions: true,
  })

  const fileText = `// tslint:disable-next-line: max-line-length
export const BROWSERLIST_REGEXP = ${regExp}
`

  fs.writeFileSync(
    './src/app/cdk/platform-info/browserlist.regexp.ts',
    fileText
  )
  console.debug('Browserlist regexp created')
}

generateBrowserlistRegexp().catch((err) => {
  console.error('Error generating browserlist regexp:', err)
  process.exit(1)
})
