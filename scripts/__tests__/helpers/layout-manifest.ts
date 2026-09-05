// A normalized snapshot of a built `dist/` tree, committed as a golden file so
// that any change to the postbuild layout shows up as a reviewable diff.
//
// Content hashes change on every build, which makes a raw file list useless as
// a golden. Collapsing hashes to a fixed marker preserves the SHAPE of the tree
// -- which locale directories exist, how many chunks each holds, what ends up
// flat in share-assets -- and the shape is precisely what the nginx and Tomcat
// routing rules in ./routing-contract.ts depend on.
//
// Usable as a library (buildManifest) or as a CLI:
//   tsx scripts/__tests__/helpers/layout-manifest.ts ./dist --write <file>
//   tsx scripts/__tests__/helpers/layout-manifest.ts ./dist --check <file>

import * as fs from 'fs'
import * as path from 'path'

export type LayoutManifest = Record<string, number>

// `.` or `-` then exactly 16 lowercase hex: a webpack content hash, as in
// main.9f2c1a0b7d4e6538-en.js. The lookahead is what enforces "exactly" -- a
// longer hex run is left alone rather than half-replaced.
const WEBPACK_HASH_RE = /[.-][0-9a-f]{16}(?![0-9a-f])/g

// `-` then exactly 8 uppercase alphanumerics: an esbuild content hash, as in
// chunk-QW4K7ZP2.js. The repo still builds with the webpack browser builder, so
// this matches nothing today; normalizing it now means the golden survives the
// esbuild migration instead of turning into one enormous diff on that day.
const ESBUILD_HASH_RE = /-[0-9A-Z]{8}(?![0-9A-Z])/g

// What both hash rules collapse to. Deliberately a shape no real filename can
// contain, so LEADING_CHUNK_ID_RE below cannot key off anything but a hash this
// module already replaced.
const HASH_MARKER = '-<h>'

// A leading numeric webpack chunk id, but only when the hash marker follows it
// immediately: 105-<h>-en.js -> chunk-<h>-en.js. Webpack numbers lazy chunks by
// build order, so the ids churn whenever an unrelated lazy route is added and
// carry nothing the golden should be pinned to. The lookahead is what keeps
// ordinary names that merely start with a digit intact: 3rdpartylicenses.txt
// must not become chunkrdpartylicenses.txt.
const LEADING_CHUNK_ID_RE = /^\d+(?=-<h>)/

/**
 * Normalizes the volatile parts of a file's BASENAME.
 *
 * Traced by hand against the rules above; these are the outputs they produce:
 *
 *   main.9f2c1a0b7d4e6538-en.js  -> main-<h>-en.js
 *   105.aeb3547eda2d9bbd-en.js   -> chunk-<h>-en.js
 *   styles.6cbe2b2f2a2ee7a5.css  -> styles-<h>.css
 *   chunk-QW4K7ZP2.js            -> chunk-<h>.js
 *   3rdpartylicenses.txt         -> 3rdpartylicenses.txt
 *   fetch-orcid.js               -> fetch-orcid.js
 *   new-relic.runtime.0123456789abcdef-fr.js
 *                                -> new-relic.runtime-<h>-fr.js
 *
 * Order matters: both hash rules must run before LEADING_CHUNK_ID_RE, because
 * that rule keys off the marker they leave behind.
 */
function normalizeBasename(basename: string): string {
  return basename
    .replace(WEBPACK_HASH_RE, HASH_MARKER)
    .replace(ESBUILD_HASH_RE, HASH_MARKER)
    .replace(LEADING_CHUNK_ID_RE, 'chunk')
}

/**
 * Directory segments are deliberately left untouched. A locale directory's name
 * IS the routing contract (LOCALE_DIR_RE in ./routing-contract.ts), so
 * normalizing anything inside one would hide the exact regression this golden
 * exists to catch -- zh_CN quietly reverting to zh-CN, for instance.
 */
function normalizeRelativePath(relativePath: string): string {
  const lastSlash = relativePath.lastIndexOf('/')
  if (lastSlash === -1) {
    return normalizeBasename(relativePath)
  }
  const dir = relativePath.slice(0, lastSlash + 1)
  return dir + normalizeBasename(relativePath.slice(lastSlash + 1))
}

// Paths are joined with '/' as we descend rather than reconstructed with
// path.relative, so the keys are forward-slashed on Windows too and the golden
// stays comparable across machines.
function walk(dir: string, prefix: string, counts: Map<string, number>): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const relativePath = prefix + entry.name
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), relativePath + '/', counts)
      continue
    }
    const key = normalizeRelativePath(relativePath)
    counts.set(key, (counts.get(key) || 0) + 1)
  }
}

export function buildManifest(distRoot: string): LayoutManifest {
  const counts = new Map<string, number>()
  walk(distRoot, '', counts)

  // Insert in sorted order: JSON.stringify emits string keys in insertion
  // order, so this is what makes the golden byte-stable rather than dependent
  // on readdir order. Plain .sort() compares UTF-16 code units and is therefore
  // machine-independent, which localeCompare would not be. (No key is an
  // integer-like string, which JS would hoist and reorder.)
  const manifest: LayoutManifest = {}
  const keys = Array.from(counts.keys()).sort()
  for (const key of keys) {
    manifest[key] = counts.get(key)
  }
  return manifest
}

const USAGE =
  'usage: tsx scripts/__tests__/helpers/layout-manifest.ts <distRoot> --write|--check <file>'

function formatSummary(manifest: LayoutManifest): string {
  const keys = Object.keys(manifest)
  let total = 0
  for (const key of keys) {
    total += manifest[key]
  }
  return `${keys.length} entries, ${total} files`
}

function main(argv: string[]): void {
  const distRoot = argv[0]
  const mode = argv[1]
  const manifestPath = argv[2]
  const validMode = mode === '--write' || mode === '--check'

  if (!distRoot || !validMode || !manifestPath) {
    console.error(USAGE)
    process.exit(1)
  }

  if (!fs.existsSync(distRoot) || !fs.statSync(distRoot).isDirectory()) {
    console.error(`error: dist root is not a directory: ${distRoot}`)
    console.error('Run `yarn build` first, or pass the correct path.')
    process.exit(1)
  }

  const manifest = buildManifest(distRoot)

  if (mode === '--write') {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    console.log(`wrote ${manifestPath}: ${formatSummary(manifest)}`)
    return
  }

  if (!fs.existsSync(manifestPath)) {
    console.error(`error: golden manifest not found: ${manifestPath}`)
    console.error('Create it by re-running with --write.')
    process.exit(1)
  }

  const expected = JSON.parse(
    fs.readFileSync(manifestPath, 'utf8')
  ) as LayoutManifest

  // A new or missing KEY is a change to the shape of the deployed tree: a file
  // kind that moved directory, a locale that stopped being emitted, a bundle
  // that lost its locale suffix. Those break routing, so they fail.
  //
  // A changed COUNT under an existing key is almost always just lazy chunks:
  // adding a lazily loaded route bumps chunk-<h>-*.js in all 21 locales at
  // once. Gating on that would force a re-record on ordinary feature work
  // while proving nothing about routing, so counts are reported and not
  // enforced. Pass --strict when you do want them exact, which is the useful
  // mode when checking that a bundler migration changed nothing.
  const strict = argv.includes('--strict')

  const structural: string[] = []
  const counts: string[] = []
  const allKeys = Array.from(
    new Set(Object.keys(expected).concat(Object.keys(manifest)))
  ).sort()

  for (const key of allKeys) {
    const before = expected[key]
    const after = manifest[key]
    if (before === undefined) {
      structural.push(`+ ${key} (${after})`)
    } else if (after === undefined) {
      structural.push(`- ${key} (${before})`)
    } else if (before !== after) {
      counts.push(`~ ${key} (${before} -> ${after})`)
    }
  }

  if (counts.length > 0) {
    console.log(`file counts changed vs ${manifestPath} (not a failure):`)
    for (const line of counts) {
      console.log(`  ${line}`)
    }
  }

  if (structural.length > 0 || (strict && counts.length > 0)) {
    console.error(`layout drift vs ${manifestPath}:`)
    for (const line of structural) {
      console.error(`  ${line}`)
    }
    if (strict) {
      for (const line of counts) {
        console.error(`  ${line}`)
      }
    }
    console.error('')
    console.error(
      'Each line is a change production will see. Check ./routing-contract.ts'
    )
    console.error('before accepting it; if intended, re-run with --write.')
    process.exit(1)
  }

  console.log(`OK: ${formatSummary(manifest)} match ${manifestPath}`)
}

// scripts/tsconfig.json sets "module": "commonjs" and tsx transpiles this file
// to CJS, so `module` and `require.main` are real at runtime -- the same guard
// scripts/environment.prebuild.ts uses. It also keeps `import { buildManifest }`
// from a test harmless: require.main is then the test runner's entry rather
// than this file, so the CLI never fires.
if (require.main === module) {
  main(process.argv.slice(2))
}
