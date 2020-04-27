// This file contains some updates made right after Angular Cli

import { uniqueLength } from './unique-length.postbuild'
import { buildInfo } from './build-info.postbuild'
import { googleAnalytics } from './google-analytics.postbuild'
import { hotjarAnalytics } from './hotjar-analytics.postbuild'
import {
  addLanguageCodeToHashesOnToHTMLFiles,
  addLanguageCodeToHashesOnJSFiles,
} from './uniqueLanguageFilesNames'
import { getOptionsObjet, read, save } from './utils'
import { renameSync } from 'fs'
const glob = require('glob')
// Run updates on index.html files across languages
glob
  .sync('./dist/*/index.html', { ignore: './dist/storybook/*' })
  .forEach((file) => {
    const options = getOptionsObjet(file)
    read(file, (data) => {
      data = uniqueLength(data, options)
      data = buildInfo(data, options)
      data = googleAnalytics(data, options)
      data = hotjarAnalytics(data, options)
      data = addLanguageCodeToHashesOnToHTMLFiles(data, options)
      save(data, options)
    })
  })

// The following code is added to generate unique hash names for each language.
// Currently Angular 9 localized builds use the same hashes for equivalent files across languages
// this did not happened on Angular 8, and produce issues with the cache when the language is change
//
// More info
// https://github.com/angular/angular-cli/issues/16526
//
// Because of this the following code will concat the language code to all generated .js files
// for instance `10-es5.<hash>-<language code>.js` and `polyfills-es2015.<hash>-<language code>.js
// and it also updates the references on the `index.html` file (see line 24) and `runtime*.js` files

// Rename all .js files to concat the language code
const hashRegExp = RegExp(/[a-z0-9]{20}/gm)
const replacedHash = {}
glob.sync('./dist/*/*.js', { ignore: './dist/storybook/*' }).forEach((file) => {
  const options = getOptionsObjet(file)
  const hash = file.match(hashRegExp)
  renameSync(file, file.replace('.js', '-' + options.languageCode + '.js'))
  // Save all the modified hash to update
  replacedHash[hash] = true
})

// Replace all the `runtime*.js` references to match updated hash values
glob
  .sync('./dist/*/runtime-*.js', { ignore: './dist/storybook/*' })
  .forEach((file) => {
    const options = getOptionsObjet(file)
    read(file, (data) => {
      data = addLanguageCodeToHashesOnJSFiles(
        data,
        Object.keys(replacedHash),
        options
      )
      save(data, options)
    })
  })
