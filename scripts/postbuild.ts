import glob = require('glob')
import fs = require('fs')
import { uniqueIndexLength } from './unique.index.length.post-build'
import { buildInfo } from './build-info.postbuild'

glob('./dist/*/index.html', (er, files: string[]) => {
  console.log(process.argv)
  const environmentIndex = process.argv.indexOf('--env')
  let environment = ''

  if (environmentIndex > -1) {
    environment = process.argv[environmentIndex + 1]
  }

  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return console.log(err)
      }
      const languageCode = file.split('/')[2]

      data = uniqueIndexLength(data, {
        languageCode: languageCode,
        environment: environment,
      })
      data = buildInfo(data, {
        languageCode: languageCode,
        environment: environment,
      })

      fs.writeFile(file, data, 'utf8', err => {
        if (err) {
          return console.log(err)
        }
      })
    })
  })
})
