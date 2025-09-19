#!/usr/bin/env node

// Enforce branch naming: <developer-name>/AA-0000
// - developer-name: lowercase letters, numbers, dot, underscore, hyphen (one or more)
// - ticket: exactly 2 uppercase letters, hyphen, exactly 4 digits (e.g., PD-0000)
// Examples:
//   yourname/PD-0000
//   john_doe/AB-0123

const { execSync } = require('child_process')

function getCurrentBranch() {
  try {
    // Try symbolic-ref first; fallback to rev-parse
    const name = execSync('git symbolic-ref --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return name
  } catch (_) {
    try {
      const name = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
      return name
    } catch (e) {
      return ''
    }
  }
}

function main() {
  const branch = getCurrentBranch()

  // If detached HEAD or empty, do not block local commits
  if (!branch || branch === 'HEAD') {
    process.exit(0)
  }

  // developer-name / AA-0000
  const pattern = /^[a-z0-9._-]+\/[A-Z]{2}-\d{4}$/

  if (!pattern.test(branch)) {
    console.error('\u001b[31mBranch name must follow "<developer-name>/AA-0000" where the ticket looks like "AA-0000".\u001b[0m')
    console.error('\nExamples:')
    console.error('  yourname/PD-0000')
    console.error('  john_doe/AB-0123')
    console.error('\nYour branch was:')
    console.error(`  ${branch || '(empty)'}`)
    process.exit(1)
  }

  process.exit(0)
}

try {
  main()
} catch (err) {
  console.error('\u001b[31mUnable to validate branch name\u001b[0m')
  console.error(err?.message || err)
  process.exit(1)
}
