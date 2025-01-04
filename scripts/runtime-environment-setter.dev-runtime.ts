import * as fs from 'fs'
import * as path from 'path'
import { runtimeEnvironmentScript } from './utils'

function main() {
  // Create the script content
  const scriptContent = `//DO NOT MODIFY THIS environment file directly, to updat this file. 
//To update environments please update the files under "/Users/l.mendoza/code/orcid-angular/src/environments" 
${runtimeEnvironmentScript()}`

  // Write the file. For example, dist/local-dev-environment.js
  const outputPath = path.resolve(
    __dirname,
    '../src/assets/local-dev-environment.js'
  )

  fs.writeFileSync(outputPath, scriptContent, { encoding: 'utf8' })

  console.log(`Generated: ${outputPath}`)
}
console.log('runtime-environment-setter.dev-runtime.ts')
if (require.main === module) {
  main()
}
