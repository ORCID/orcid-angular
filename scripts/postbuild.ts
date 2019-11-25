import { readFile, indexHtml, saveIndex } from './index-html.postbuild'

import * as environmentLocal from '../src/environments/environment.local'
import * as environmentTomcat from '../src/environments/environment.local.tomcat'
import * as environmentProduction from '../src/environments/environment.production'
import * as environmentQa from '../src/environments/environment.qa'
import * as environmentSandbox from '../src/environments/environment.sandbox'
const glob = require('glob')

glob(
  './dist/*/index.html',
  { ignore: './dist/storybook/*' },
  (er, files: string[]) => {
    files.forEach(file => {
      readFile(file, data => {
        const options = getOptionsObjet(file)
        data = indexHtml(data, options)
        saveIndex(data, options)
      })
    })
  }
)

function getOptionsObjet(file) {
  const environment = getEnvironmentVar()
  const languageCode = getLanguageCode(file)
  let environmentVariables

  if (environment === 'production') {
    environmentVariables = environmentProduction.environment
  } else if (environment === 'qa') {
    environmentVariables = environmentQa.environment
  } else if (environment === 'sandbox') {
    environmentVariables = environmentSandbox.environment
  } else {
    console.warn('the environment variable is invalid')
  }

  return {
    languageCode,
    environment,
    file,
    environmentVariables,
  }
}

function getEnvironmentVar() {
  const environmentIndex = process.argv.lastIndexOf('--env')
  let environment = ''

  if (environmentIndex > -1) {
    environment = process.argv[environmentIndex + 1]
  }

  return environment
}
function getLanguageCode(file) {
  return file.split('/')[2]
}
