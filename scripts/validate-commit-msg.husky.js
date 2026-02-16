#!/usr/bin/env node

// Enforce commit message format: AAAA-000[0] [optional message]
//  - AAAA: 2+ uppercase letters (A-Z)
//  - 000[0]: 3 or 4 digits
//  - Example: PD-0000 Add feature
//  - Also valid: PD-0000
//  - Also valid: ENGAGE-243

const fs = require('fs')

function isCiMergeOnMain() {
  // allow merges to main based on GitHub refs
  try {
    const isCi = String(process.env.CI || '').toLowerCase() === 'true'
    if (!isCi) return false

    const refName = process.env.GITHUB_REF_NAME // e.g., 'main'
    const ref = process.env.GITHUB_REF // e.g., 'refs/heads/main'

    return refName === 'main' || ref === 'refs/heads/main'
  } catch (_) {
    return false
  }
}

try {
  const commitMsgFile = process.argv[2]
  const raw = fs.readFileSync(commitMsgFile, 'utf8')

  // Use first non-empty, non-comment line as subject
  const firstLine =
    raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#')) || ''

  // Allow CI merges on main branch
  if (isCiMergeOnMain()) {
    process.exit(0)
  }

  // Allow merge commits (e.g., "Merge branch ...", "Merge pull request ...")
  if (/^Merge\b/.test(firstLine)) {
    process.exit(0)
  }

  // Allow Transifex automated commits
  if (/^Transifex\b/.test(firstLine)) {
    process.exit(0)
  }

  // Pattern: start, 2+ uppercase letters, hyphen, 3-4 digits, optional space and message
  const pattern = /^[A-Z]{2,}-\d{3,4}(?:\s.+)?$/

  if (!pattern.test(firstLine)) {
    console.error(
      '\u001b[31mCommit message must start with an issue key like "AAAA-000[0]" followed by an optional message.\u001b[0m'
    )
    console.error('\nExamples:')
    console.error('  PD-0000')
    console.error('  ENGAGE-243')
    console.error('  PD-0000 Fix broken tests')
    console.error('\nYour message was:')
    console.error(`  ${firstLine || '(empty)'}`)
    process.exit(1)
  }

  process.exit(0)
} catch (e) {
  console.error('\u001b[31mUnable to validate commit message\u001b[0m')
  console.error(e?.message || e)
  process.exit(1)
}
