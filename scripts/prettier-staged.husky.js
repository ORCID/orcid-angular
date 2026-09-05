#!/usr/bin/env node

// - Runs `prettier --check` over the staged files only
// - Silent on success
// - Prints the offending files and exits 1 on failure
//
// Formatting used to be fixed after the fact by a job on main
// (format_prettier.yml), which committed and cancelled its own run. It is now
// a PR gate (format_check.yml); this hook catches it one step earlier.

const { spawnSync } = require('child_process')
const fs = require('fs')

function stagedFiles() {
  const res = spawnSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    { encoding: 'utf8' }
  )
  if (res.status !== 0) {
    console.error('Could not list staged files.')
    console.error(res.stderr || '')
    process.exit(1)
  }
  return res.stdout
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter((f) => f.length > 0)
    .filter((f) => fs.existsSync(f)) // skip files staged then removed from disk
}

function main() {
  const files = stagedFiles()
  if (files.length === 0) {
    process.exit(0)
  }

  // --ignore-unknown skips files prettier has no parser for (images, xlf, ...)
  // instead of failing on them.
  const res = spawnSync(
    'npx',
    ['prettier', '--check', '--ignore-unknown', ...files],
    { stdio: 'inherit' }
  )

  if (res.error) {
    console.error('Could not run prettier.')
    console.error(res.error.message)
    process.exit(1)
  }

  if (res.status !== 0) {
    console.error('')
    console.error('Formatting issues found. Fix them with:')
    console.error('  yarn format')
    process.exit(res.status || 1)
  }

  process.exit(0)
}

main()
