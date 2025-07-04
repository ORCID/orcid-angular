// This file contains some updates made right after Angular Cli

import { buildInfo } from './build-info.postbuild'
import {
  addLanguageCodeToHashesOnToHTMLFiles,
  addLanguageCodeToHashesOnJSFiles,
} from './uniqueLanguageFilesNames'
import { getOptionsObjet, save } from './utils'
import { renameSync, readFileSync } from 'fs'
import { createShareAssetsFolder } from './moveToShareFolder.postbuild'
import { addOneTrustNotAutoBlockForAppScripts } from './onetrust.postbuild'
import { newRelic } from './new-relic.postbuild'

const glob = require('glob')
// Run updates on index.html files across languages
glob.sync('./dist/*/index.html').forEach((file) => {
  const options = getOptionsObjet(file)
  let data = readFileSync(file, 'utf8')
  data = buildInfo(data, options)
  // Replace all the `*.js` references to match updated JS file names with the language code.
  data = addLanguageCodeToHashesOnToHTMLFiles(data, options)
  data = addOneTrustNotAutoBlockForAppScripts(data)
  data = newRelic(data)

  // data = robotsMetadata(data, options) DISABLE robots headers, as those will be handle via nginx
  save(data, options)
})

// The following code is added to generate unique hash names for each language.
// For instance `runtime.<hash>.js` and `polyfills.<hash>.js will will become `runtime.<hash>-it.js` and `polyfills.<hash>-it.js for italian
const hashRegExp = RegExp(/[a-z0-9]{16}/gm)
const replacedHash = {}
glob.sync('./dist/*/*.js').forEach((file) => {
  const options = getOptionsObjet(file)
  const hash = file.match(hashRegExp)
  renameSync(file, file.replace('.js', '-' + options.languageCode + '.js'))
  // Save all the modified hash to update
  replacedHash[hash] = true
})

// Replace all the `runtime*.js` references to match updated JS values with language code
glob.sync('./dist/*/runtime*.js').forEach((file) => {
  const options = getOptionsObjet(file)
  let data = readFileSync(file, 'utf8')
  data = addLanguageCodeToHashesOnJSFiles(
    data,
    Object.keys(replacedHash),
    options
  )
  save(data, options)
})

// Rename chinese folders to use underscore to allow Orcid Source and Nginx to correctly point these folders
glob.sync('./dist/*/index.html').forEach((file) => {
  const options = getOptionsObjet(file)
  renameSync(options.folder, options.folder.replace('-', '_'))
})

// Move all assets into a single shared folder
createShareAssetsFolder()
