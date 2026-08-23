#!/usr/bin/env node
/**
 * Applies a given model's translations (translation-experiment/{model}/{lang}/{feature}.json)
 * into the blanked <target/> elements of src/locale/messages.{lang}.xlf.
 *
 * Only the experiment's scoped keys are applied (derived from the human backups,
 * see scope.js) — any extra keys an AI translated beyond the scope are ignored
 * (they were never blanked).
 *
 * Usage: node apply-translations.js <model-name>
 *   e.g. node apply-translations.js claude-sonnet-5
 */

const fs = require('fs')
const path = require('path')

const MODEL = process.argv[2]
if (!MODEL) {
  console.error('Usage: node apply-translations.js <model-name>')
  process.exit(1)
}

const LOCALE_DIR = path.resolve(__dirname, '../../src/locale')
const EXPERIMENT_DIR = path.resolve(__dirname, '..')
const MODEL_DIR = path.join(EXPERIMENT_DIR, MODEL)

if (!fs.existsSync(MODEL_DIR)) {
  console.error(`Model folder not found: ${MODEL_DIR}`)
  process.exit(1)
}

const LANGUAGES = ['zh_CN', 'de', 'pt', 'es', 'fr', 'it', 'ja', 'ru']
const FEATURES = ['two-factor', 'developer-tools', 'register']

// The experiment's scoped key set — ONLY these were blanked in Phase 2, so ONLY
// these may be overwritten here. AI models often translate extra keys they find
// while exploring a component; those extras must be ignored to avoid clobbering
// human translations that were never part of the experiment.
const EXPERIMENT_KEYS = new Set(
  FEATURES.flatMap((feature) =>
    Object.keys(
      JSON.parse(
        fs.readFileSync(
          path.join(EXPERIMENT_DIR, 'human', 'de', `${feature}.json`),
          'utf8'
        )
      )
    )
  )
)

// XML-escape a translated string for insertion into <target>...</target>
function xmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

let totalApplied = 0

for (const lang of LANGUAGES) {
  // Merge all 3 feature files for this language into one keyId -> translation map
  const merged = {}
  for (const feature of FEATURES) {
    const filePath = path.join(MODEL_DIR, lang, `${feature}.json`)
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ Missing ${MODEL}/${lang}/${feature}.json`)
      continue
    }
    Object.assign(merged, JSON.parse(fs.readFileSync(filePath, 'utf8')))
  }

  const xlfPath = path.join(LOCALE_DIR, `messages.${lang}.xlf`)
  let xml = fs.readFileSync(xlfPath, 'utf8')
  let appliedForLang = 0

  xml = xml.replace(
    /(<trans-unit[^>]+resname="([^"]+)"[^>]*>)([\s\S]*?)(<\/trans-unit>)/g,
    (match, openTag, resname, body, closeTag) => {
      if (!EXPERIMENT_KEYS.has(resname)) return match
      if (!(resname in merged)) return match
      const translated = xmlEscape(merged[resname])
      const newBody = body.replace(
        /<target\/>|<target[^>]*>[\s\S]*?<\/target>/,
        `<target>${translated}</target>`
      )
      appliedForLang++
      return openTag + newBody + closeTag
    }
  )

  fs.writeFileSync(xlfPath, xml, 'utf8')
  totalApplied += appliedForLang
  console.log(`  ✓ ${lang}: applied ${appliedForLang} translations from ${MODEL}`)
}

console.log(`\nDone. ${totalApplied} translations from "${MODEL}" applied across ${LANGUAGES.length} language files.`)
