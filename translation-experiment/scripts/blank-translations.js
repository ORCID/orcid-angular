#!/usr/bin/env node
/**
 * Phase 2: Blank <target> elements for experiment keys in 8 language XLF files.
 * Run AFTER extract-translations.js. Originals are backed up in ../human/.
 * Uses string replacement to stay XLIFF-valid for the Angular compiler.
 * Experiment key set is defined in scope.js.
 */

const fs = require('fs')
const path = require('path')
const { ALL_KEYS: EXPERIMENT_KEYS } = require('./scope')

const LOCALE_DIR = path.resolve(__dirname, '../../src/locale')

const LANGUAGES = ['zh_CN', 'de', 'pt', 'es', 'fr', 'it', 'ja', 'ru']

// Matches a <trans-unit> block (possibly multi-line) and blanks its <target> content
function blankTargets(xml) {
  // Match each trans-unit block and blank the target if its resname is in experiment keys
  return xml.replace(
    /(<trans-unit[^>]+resname="([^"]+)"[^>]*>)([\s\S]*?)(<\/trans-unit>)/g,
    (match, openTag, resname, body, closeTag) => {
      if (!EXPERIMENT_KEYS.has(resname)) return match
      // Replace <target ...>...</target> with <target/>
      const blanked = body.replace(
        /<target[^>]*>[\s\S]*?<\/target>/g,
        '<target/>'
      )
      return openTag + blanked + closeTag
    }
  )
}

let totalBlanked = 0

for (const lang of LANGUAGES) {
  const xlfPath = path.join(LOCALE_DIR, `messages.${lang}.xlf`)
  if (!fs.existsSync(xlfPath)) {
    console.warn(`SKIP: ${xlfPath} not found`)
    continue
  }

  const original = fs.readFileSync(xlfPath, 'utf8')
  const modified = blankTargets(original)

  const blankedCount = (original.match(/<target[^/][\s\S]*?<\/target>/g) || [])
    .filter((_, i) => {
      // count how many got replaced - approximate via diff
      return true
    }).length

  if (original === modified) {
    console.warn(`  ⚠ No changes in ${lang} — keys may already be blank or resname attribute missing`)
  } else {
    fs.writeFileSync(xlfPath, modified, 'utf8')
    // Count blanked by comparing <target/> occurrences
    const before = (original.match(/<target\/>/g) || []).length
    const after = (modified.match(/<target\/>/g) || []).length
    const count = after - before
    totalBlanked += count
    console.log(`  ✓ ${lang}: blanked ${count} targets`)
  }
}

console.log(`\nDone. ${totalBlanked} targets blanked across ${LANGUAGES.length} language files.`)
console.log('Run "ng build --configuration=fr" to verify the build still compiles.')
