const glob = require('glob')
import { readFile, indexHtml, saveIndex } from './index-html.postbuild'

glob('./dist/*/index.html', (er, files: string[]) => {
  files.forEach(file => {
    readFile(file, data => {
      data = indexHtml(data, file)
      saveIndex(data, file)
    })
  })
})
