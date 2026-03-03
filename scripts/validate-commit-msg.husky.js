#!/usr/bin/env node

// Enforce commit message format: PROJECT-NNN [optional message]
//  - PROJECT: one or more uppercase letters (A-Z)
//  - NNN: one or more digits
//  - Examples: PD-0000, ENGAGE-243, ENGAGE-243 Add feature

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

  // Pattern: PROJECT-NNN (e.g. PD-0000, ENGAGE-243), optional space and message
  const pattern = /^[A-Z]+-\d+(?:\s.+)?$/

  if (!pattern.test(firstLine)) {
    console.error(
      '\u001b[31mCommit message must start with an issue key like "PROJECT-NNN" (e.g. PD-0000, ENGAGE-243) followed by an optional message.\u001b[0m'
    )
    console.error('\nExamples:')
    console.error('  PD-0000')
    console.error('  ENGAGE-243')
    console.error('  ENGAGE-243 Fix broken tests')
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
