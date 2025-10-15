import * as fs from 'fs'
import { getUserAgentRegExp } from 'browserslist-useragent-regexp'

// Using browserslist-useragent-regexp a browserslist REGEXP is generated to be used on the application run time
// This will decide wether show or hide the unsupported browser version banner

const regExp = getUserAgentRegExp({
  allowHigherVersions: true,
  allowZeroSubversions: true,
})

const fileText = `// tslint:disable-next-line: max-line-length
export const BROWSERLIST_REGEXP = ${regExp}
`

fs.writeFile(
  './src/app/cdk/platform-info/browserlist.regexp.ts',
  fileText,
  (err) => {
    if (err) {
      throw new Error('Error creating browserlist regexp ' + err)
    }
    console.debug('Browserlist regexp created')
  }
)
