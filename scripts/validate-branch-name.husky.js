#!/usr/bin/env node

// Enforce branch naming: <developer-name>/PROJECT-NNN[anything]
// - developer-name: lowercase letters, numbers, dot, underscore, hyphen (one or more)
// - ticket: one or more uppercase letters, hyphen, one or more digits (e.g., PD-0000, ENGAGE-243)
// - suffix: any optional characters after the ticket (e.g., "/feature-x", "-refactor", etc.)
// Special allowed names: transifex
// Examples:
//   yourname/PD-0000
//   lmendoza/ENGAGE-243
//   yourname/PD-0000-my-feature
//   your.name/AB-0123/quick-fix

const { execSync } = require('child_process')

function isCiOnMain() {
  // allow actions that run on main based on GitHub refs
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

  // Allow CI (GitHub Actions) jobs running on main
  if (isCiOnMain()) {
    process.exit(0)
  }

  // Allowed special branch names
  const special = new Set(['transifex'])
  if (special.has(branch)) {
    process.exit(0)
  }

  // developer-name / PROJECT-NNN [anything] (e.g. PD-0000, ENGAGE-243)
  const pattern = /^[a-z0-9._-]+\/[A-Z]+-\d+.*$/

  if (!pattern.test(branch)) {
    console.error(
      '\u001b[31mBranch name must follow "<developer-name>/PROJECT-NNN[anything]" or be a special allowed name (e.g., "transifex").\u001b[0m'
    )
    console.error('\nExamples:')
    console.error('  yourname/PD-0000')
    console.error('  lmendoza/ENGAGE-243')
    console.error('  yourname/PD-0000-my-feature')
    console.error('  your.name/AB-0123/quick-fix')
    console.error('  transifex')
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
