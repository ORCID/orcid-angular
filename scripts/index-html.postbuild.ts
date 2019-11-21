import { uniqueLength } from './unique-length.postbuild'
import { buildInfo } from './build-info.postbuild'
import * as fs from 'fs'

export function indexHtml(data, file) {
  const environment = getEnvironmentVar()
  const languageCode = getLanguageCode(file)
  const options = {
    languageCode,
    environment,
  }

  data = uniqueLength(data, options)
  data = buildInfo(data, options)

  return data
}

export function saveIndex(data, file) {
  fs.writeFile(file, data, 'utf8', err => {
    if (err) {
      console.log(err)
      throw err
    }
  })
}

export function readFile(file, callback) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      throw err
    }
    return callback(data)
  })
}

function getEnvironmentVar() {
  const environmentIndex = process.argv.indexOf('--env')
  let environment = ''

  if (environmentIndex > -1) {
    environment = process.argv[environmentIndex + 1]
  }

  return environment
}

function getLanguageCode(file) {
  return file.split('/')[2]
}
