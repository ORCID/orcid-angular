import { uniqueLength } from './unique-length.postbuild'
import { buildInfo } from './build-info.postbuild'
import * as fs from 'fs'
import { googleAnalytics } from './google-analytics.postbuild'
import { hotjarAnalytics } from './hotjar-analytics.postbuild'

export function indexHtml(data, options) {
  data = uniqueLength(data, options)
  data = buildInfo(data, options)
  data = googleAnalytics(data, options)
  data = hotjarAnalytics(data, options)

  return data
}

export function saveIndex(data, options) {
  fs.writeFile(options.file, data, 'utf8', err => {
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
