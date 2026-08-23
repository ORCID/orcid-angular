#!/usr/bin/env node
/**
 * Phase 1: Extract human translations for the experiment features into JSON backups.
 * Run before blanking. Output: translation-experiment/human/{lang}/{feature}.json
 * Feature key sets are defined in scope.js.
 */

const fs = require('fs')
const path = require('path')
const { FEATURES } = require('./scope')

const LOCALE_DIR = path.resolve(__dirname, '../../src/locale')
const OUTPUT_DIR = path.resolve(__dirname, '../human')

const LANGUAGES = ['zh_CN', 'de', 'pt', 'es', 'fr', 'it', 'ja', 'ru']

function parseXlf(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8')
  const result = {}
  // Match each trans-unit block (XLIFF 1.2 structure is predictable)
  const unitRe = /<trans-unit[^>]+resname="([^"]+)"[\s\S]*?<\/trans-unit>/g
  const sourceRe = /<source[^>]*>([\s\S]*?)<\/source>/
  const targetRe = /<target[^>]*>([\s\S]*?)<\/target>/
  let match
  while ((match = unitRe.exec(xml)) !== null) {
    const resname = match[1]
    const block = match[0]
    const sourceMatch = sourceRe.exec(block)
    const targetMatch = targetRe.exec(block)
    result[resname] = {
      source: sourceMatch ? sourceMatch[1].trim() : '',
      human: targetMatch ? targetMatch[1].trim() : '',
    }
  }
  return result
}

let totalExtracted = 0

for (const lang of LANGUAGES) {
  const xlfPath = path.join(LOCALE_DIR, `messages.${lang}.xlf`)
  if (!fs.existsSync(xlfPath)) {
    console.warn(`SKIP: ${xlfPath} not found`)
    continue
  }

  const allTranslations = parseXlf(xlfPath)
  const langDir = path.join(OUTPUT_DIR, lang)
  fs.mkdirSync(langDir, { recursive: true })

  for (const [feature, keys] of Object.entries(FEATURES)) {
    const output = {}
    for (const key of keys) {
      if (allTranslations[key]) {
        output[key] = allTranslations[key]
      } else {
        console.warn(`  MISSING key "${key}" in ${lang}`)
        output[key] = { source: '', human: '' }
      }
    }
    const outPath = path.join(langDir, `${feature}.json`)
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n')
    totalExtracted += Object.keys(output).length
    console.log(`  ✓ ${lang}/${feature}.json (${Object.keys(output).length} keys)`)
  }
}

console.log(`\nDone. ${totalExtracted} translations backed up to ${OUTPUT_DIR}`)
