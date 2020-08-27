import * as fs from 'fs'
import {
  NgOrcidPropertyFolder,
  OrcidSourcePropertyFolder,
} from './properties-folder-manager'

const args = process.argv.slice(2)
if (args.length !== 2) {
  console.error(
    '2 parameters are require: destiny folder path where translations will be added\n' +
      'and origin folder path where values are going to be copied from'
  )
} else if (!fs.readdirSync(args[0]) || !fs.readdirSync(args[1])) {
  console.error('the destiny or origin folder does no exists ')
} else {
  // Open ng orcid
  const ngOrcid = new NgOrcidPropertyFolder(args[0])
  // Open orcid source
  const orcidSource = new OrcidSourcePropertyFolder(args[1])
  // Clone values from orcid source
  ngOrcid.cloneValues(orcidSource)
  // Create rl, lr and xx testing languages
  ngOrcid.generateTestingLanguages()
  // Save generated files on a /temp folder
  ngOrcid.save('./tmp', false)
}
