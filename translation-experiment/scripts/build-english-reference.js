#!/usr/bin/env node
/**
 * Builds an English-reference folder from the already-extracted human backups'
 * "source" field (identical across languages — English is the XLIFF source locale).
 * Output: translation-experiment/english/{feature}.json
 */

const fs = require('fs')
const path = require('path')

const HUMAN_DIR = path.resolve(__dirname, '../human')
const OUTPUT_DIR = path.resolve(__dirname, '../english')

// Any single language folder has the same "source" values for every feature.
const REFERENCE_LANG = 'de'

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const featureFiles = fs.readdirSync(path.join(HUMAN_DIR, REFERENCE_LANG))

for (const file of featureFiles) {
  const feature = file.replace('.json', '')
  const data = JSON.parse(fs.readFileSync(path.join(HUMAN_DIR, REFERENCE_LANG, file), 'utf8'))

  const englishOnly = {}
  for (const [key, { source }] of Object.entries(data)) {
    englishOnly[key] = source
  }

  const outPath = path.join(OUTPUT_DIR, file)
  fs.writeFileSync(outPath, JSON.stringify(englishOnly, null, 2) + '\n')
  console.log(`✓ english/${file} (${Object.keys(englishOnly).length} keys)`)
}

console.log(`\nDone. English reference written to ${OUTPUT_DIR}`)
