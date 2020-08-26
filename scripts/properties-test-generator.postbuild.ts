import { NgOrcidPropertyFolder } from './properties-folder-manager'

// Open ng orcid
const ngOrcid = new NgOrcidPropertyFolder('./src/locale/properties')

// Create rl, lr and xx testing languages
ngOrcid.generateTestingLanguages()

// Save generated files
ngOrcid.save('./src/locale/properties', false)
