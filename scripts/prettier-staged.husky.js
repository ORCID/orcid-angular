#!/usr/bin/env node

// - Runs `prettier --check` over the staged files only
// - Silent on success
// - Prints the offending files and ALWAYS exits 0
//
// This is a heads-up, never a blocker. The enforcement point is the `format`
// job on the pull request (.github/workflows/format.yml), which fails on
// unformatted files and pushes nothing. Warning here, at commit time, is just
// the earliest moment to hear about it.
//
// It does not auto-fix either: `prettier --write` plus `git add` would stage
// unstaged hunks of a partially staged file.

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
    // Not fatal: prettier being unavailable must not block a commit.
    console.error('Could not run prettier (skipping the formatting check).')
    console.error(res.error.message)
    process.exit(0)
  }

  if (res.status !== 0) {
    console.error('')
    console.error('Heads up, this is not a blocker.')
    console.error('Formatting issues were found in the files above.')
    console.error('Run `yarn format` before you push: the format check on the')
    console.error('pull request fails on unformatted files.')
    console.error('')
  }

  process.exit(0)
}

main()
