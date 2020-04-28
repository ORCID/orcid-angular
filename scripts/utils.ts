import * as environmentProduction from '../src/environments/environment.production'
import * as environmentQa from '../src/environments/environment.qa'
import * as environmentSandbox from '../src/environments/environment.sandbox'
import { writeFile, readFile } from 'fs'

export function save(data, options) {
  writeFile(options.file, data, 'utf8', err => {
    if (err) {
      console.log(err)
      throw err
    }
  })
}

export function read(file, callback) {
  readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      throw err
    }
    return callback(data)
  })
}

export function getOptionsObjet(file) {
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
