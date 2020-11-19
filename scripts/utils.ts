import * as environmentProduction from '../src/environments/environment.production'
import * as environmentQa from '../src/environments/environment.qa'
import * as environmentSandbox from '../src/environments/environment.sandbox'
import * as environmentInt from '../src/environments/environment.int'

import { writeFileSync } from 'fs'

export function save(data, options) {
  writeFileSync(options.file, data, 'utf8')
}

export function getOptionsObjet(file) {
  const environment = getEnvironmentVar()
  const languageCode = getLanguageCode(file)
  const folder = getFolderName(file)
  let environmentVariables

  if (environment === 'production') {
    environmentVariables = environmentProduction.environment
  } else if (environment === 'qa') {
    environmentVariables = environmentQa.environment
  } else if (environment === 'sandbox') {
    environmentVariables = environmentSandbox.environment
  } else if (environment === 'int') {
    environmentVariables = environmentInt.environment
  } else {
    console.warn('the environment variable is invalid')
  }

  return {
    languageCode,
    environment,
    file,
    environmentVariables,
    folder,
  }
}

export function getEnvironmentVar() {
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

function getFolderName(file) {
  const folderPathSegments = file.split('/')
  folderPathSegments.pop()
  return folderPathSegments.join('/')
}
