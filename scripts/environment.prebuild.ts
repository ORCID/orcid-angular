import * as fs from 'fs'
import * as path from 'path'
import { runtimeEnvironmentScript } from './utils'

function main() {
  // Create the script content
  const scriptContent = `//DO NOT MODIFY THIS environment file directly, to updat this file. 
//To update environments please update the files under "/src/environments" 
${runtimeEnvironmentScript()}`

  const outputPath = path.resolve(
    __dirname,
    '../scripts/environment.runtime.js'
  )

  fs.writeFileSync(outputPath, scriptContent, { encoding: 'utf8' })

  console.info(`Generated: ${outputPath}`)
}
if (require.main === module) {
  main()
}
