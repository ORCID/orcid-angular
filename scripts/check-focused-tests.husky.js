#!/usr/bin/env node

// Cross-platform check for focused tests (works on Windows, macOS, Linux)
// - Scans TypeScript sources for fdescribe / fit
// - Silent on success
// - Prints offending locations and exits 1 on failure

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const SOURCE_GLOB = 'src/**/*.ts'
const FOCUSED_RE = /\b(fdescribe|fit)\s*\(/

function findFocusedTestsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const hits = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (FOCUSED_RE.test(line)) {
      hits.push({ lineNumber: i + 1, line })
    }
  }
  return hits
}

function main() {
  const files = glob.sync(SOURCE_GLOB, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    nodir: true,
    windowsPathsNoEscape: true,
  })

  const violations = []

  for (const file of files) {
    const hits = findFocusedTestsInFile(file)
    if (hits.length > 0) {
      for (const hit of hits) {
        violations.push({ file, ...hit })
      }
    }
  }

  if (violations.length > 0) {
    console.error('Focused tests found. Replace fdescribe → describe, fit → it:')
    for (const v of violations) {
      const rel = path.relative(process.cwd(), v.file)
      console.error(`${rel}:${v.lineNumber}: ${v.line.trim()}`)
    }
    process.exit(1)
  }

  process.exit(0)
}

try {
  main()
} catch (err) {
  console.error('Error searching for focused tests.')
  console.error(err?.message || err)
  process.exit(1)
}
