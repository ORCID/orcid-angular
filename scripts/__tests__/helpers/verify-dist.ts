/**
 * Validates a REAL `dist/` against the deployed routing contract.
 *
 * postbuild.test.ts proves the postbuild transforms a small synthetic tree
 * correctly. This proves the tree that actually ships is servable: every URL
 * the browser will request is routable by the production nginx rules and
 * resolves to a file, and every lazy chunk a bundle imports exists and belongs
 * to the same locale.
 *
 * The two are complementary. The fixture has 4 locales and a handful of files;
 * this sees all 21 locales and ~2000 bundles, including anything a feature
 * branch newly imports.
 *
 * Usage: tsx scripts/__tests__/helpers/verify-dist.ts [distRoot]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as posix from 'path/posix'

import {
  COOKIE_MAP_FOLDERS,
  LOCALE_DIR_RE,
  UNROUTABLE_LOCALE_DIRS,
  matchesDevAssetRoute,
  matchesProdAssetRoute,
} from './routing-contract'
import { NON_LOCALE_DIRS } from '../../dist-layout'

interface Problem {
  where: string
  what: string
}

const problems: Problem[] = []
const notes: string[] = []
const fail = (where: string, what: string) => problems.push({ where, what })

/** Values in an href/src/url() that are not a request for an asset. */
function isExternal(url: string): boolean {
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//') ||
    url.startsWith('data:') ||
    url.startsWith('#') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    // `<base href="/">` is not something the browser fetches
    url.trim() === '/' ||
    url.trim() === ''
  )
}

function referencedUrls(text: string): string[] {
  const found = new Set<string>()
  for (const m of text.matchAll(/(?:src|href)="([^"]+)"/g)) found.add(m[1])
  for (const m of text.matchAll(/url\(([^)]+)\)/g))
    found.add(m[1].trim().replace(/^['"]|['"]$/g, ''))
  return [...found].filter((u) => !isExternal(u))
}

/**
 * Resolves a browser URL to a file on disk the way the deployed nginx does:
 * every asset URL that matches the asset route is served from share-assets.
 * Returns null when nginx would not route the URL there at all.
 */
function resolveThroughNginx(shareAssets: string, url: string): string | null {
  if (!matchesProdAssetRoute(url)) return null
  return path.join(shareAssets, url.replace(/^\//, '').split('?')[0])
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const out: string[] = []
  const walk = (cur: string, prefix: string) => {
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) walk(path.join(cur, entry.name), rel)
      else out.push(rel)
    }
  }
  walk(dir, '')
  return out.sort()
}

function main(distRoot: string): void {
  if (!fs.existsSync(distRoot) || !fs.statSync(distRoot).isDirectory()) {
    console.error(`error: not a directory: ${distRoot}`)
    console.error('Run `yarn build` first, or pass the correct path.')
    process.exit(1)
  }

  const shareAssets = path.join(distRoot, 'share-assets')
  if (!fs.existsSync(shareAssets)) {
    console.error(`error: ${distRoot}/share-assets is missing.`)
    console.error('postbuild did not run, or it failed partway.')
    process.exit(1)
  }

  const localeDirs = fs
    .readdirSync(distRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !NON_LOCALE_DIRS.includes(name))
    .sort()

  // ---- locale directories are reachable through the Tomcat rewrite valve ----
  for (const dir of localeDirs) {
    if (!LOCALE_DIR_RE.test(dir) && !UNROUTABLE_LOCALE_DIRS.includes(dir)) {
      fail(
        `dist/${dir}`,
        'directory name does not match the Tomcat rewrite valve pattern ' +
          '[a-z]{2}(_[A-Za-z]{2})?, so every deep link under it 404s'
      )
    }
  }

  // ---- every locale nginx can select actually exists ----
  for (const folder of COOKIE_MAP_FOLDERS) {
    if (!localeDirs.includes(folder)) {
      fail(
        `dist/${folder}`,
        'missing, but the nginx cookie map routes locale_v3 to it; visitors ' +
          'holding that cookie would get nothing'
      )
    }
  }

  // ---- nothing stray at the root of the served tree ----
  const strayRootFiles = fs
    .readdirSync(distRoot, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => e.name)
  for (const file of strayRootFiles) {
    fail(
      `dist/${file}`,
      'file at the root of the deployed tree; the WAR copies dist/ verbatim, ' +
        'so this is served at the site root'
    )
  }

  // ---- every referenced URL is routable and exists ----
  const shareAssetFiles = new Set(listFiles(shareAssets))
  let urlsChecked = 0
  const devUnroutable = new Set<string>()

  const checkUrls = (source: string, text: string) => {
    for (const raw of referencedUrls(text)) {
      // Resolved against the site root: index.html carries <base href="/">.
      const url = posix.normalize(posix.join('/', raw))
      urlsChecked++

      const resolved = resolveThroughNginx(shareAssets, url)
      if (resolved === null) {
        fail(
          source,
          `references "${raw}", which the production asset route does not ` +
            `match, so nginx sends it to the Java app instead of share-assets`
        )
        continue
      }
      const relative = path
        .relative(shareAssets, resolved)
        .split(path.sep)
        .join('/')
      if (!shareAssetFiles.has(relative)) {
        fail(
          source,
          `references "${raw}" -> share-assets/${relative}, which does not exist`
        )
      }
      if (!matchesDevAssetRoute(url)) devUnroutable.add(raw)
    }
  }

  for (const dir of localeDirs) {
    const index = path.join(distRoot, dir, 'index.html')
    if (!fs.existsSync(index)) {
      fail(`dist/${dir}`, 'has no index.html')
      continue
    }
    checkUrls(`dist/${dir}/index.html`, fs.readFileSync(index, 'utf8'))
  }
  for (const file of [...shareAssetFiles].filter((f) => f.endsWith('.css'))) {
    checkUrls(
      `share-assets/${file}`,
      fs.readFileSync(path.join(shareAssets, file), 'utf8')
    )
  }

  // ---- every bundle carries a locale suffix and imports its own locale ----
  // The suffix is the directory Angular emitted, so dist/zh_CN holds -zh-CN.
  const suffixes = [
    ...new Set(localeDirs.map((d) => d.replace('_', '-'))),
  ].sort((a, b) => b.length - a.length)
  const suffixOf = (file: string) =>
    suffixes.find((s) => file.endsWith(`-${s}.js`))

  const bundles = [...shareAssetFiles].filter(
    (f) => f.endsWith('.js') && !f.includes('/')
  )
  let bundlesChecked = 0

  for (const file of bundles) {
    const locale = suffixOf(file)
    if (!locale) {
      fail(
        `share-assets/${file}`,
        'has no locale suffix; share-assets is one flat namespace and ' +
          'Cloudflare caches on the URL alone, so locales would collide'
      )
      continue
    }
    bundlesChecked++

    const source = fs.readFileSync(path.join(shareAssets, file), 'utf8')
    const specifiers = new Set(
      [
        ...source.matchAll(
          /["'](?:\.\/)?((?:chunk|main|polyfills|scripts|common|runtime)[-.][^"'/]+\.js)["']/g
        ),
      ].map((m) => m[1])
    )
    for (const spec of specifiers) {
      if (!shareAssetFiles.has(spec)) {
        fail(`share-assets/${file}`, `imports "${spec}", which does not exist`)
      } else if (suffixOf(spec) !== locale) {
        fail(
          `share-assets/${file}`,
          `(locale ${locale}) imports "${spec}", which belongs to another locale`
        )
      }
    }
  }

  // ---- the monit health check ----
  const frIndex = path.join(distRoot, 'fr', 'index.html')
  if (fs.existsSync(frIndex)) {
    if (!fs.readFileSync(frIndex, 'utf8').includes('--fr')) {
      fail(
        'dist/fr/index.html',
        "does not contain '--fr'; the monit check greps /reset-password for it " +
          'and would flap the service'
      )
    }
  }

  // ---- informational ----
  if (devUnroutable.size > 0) {
    notes.push(
      `${devUnroutable.size} referenced file(s) are routable in prod/qa/sandbox ` +
        `but not on the dev proxy, int or stage (their asset regex is narrower): ` +
        `${[...devUnroutable].slice(0, 4).join(', ')}${
          devUnroutable.size > 4 ? ', ...' : ''
        }`
    )
  }

  console.log(
    `verify-dist: ${localeDirs.length} locales, ${urlsChecked} asset URLs, ` +
      `${bundlesChecked} bundles`
  )
  for (const note of notes) console.log(`  note: ${note}`)

  if (problems.length > 0) {
    console.error('')
    console.error(`${problems.length} problem(s) in the deployed tree:`)
    for (const p of problems.slice(0, 40)) {
      console.error(`  ${p.where}: ${p.what}`)
    }
    if (problems.length > 40) {
      console.error(`  ... and ${problems.length - 40} more`)
    }
    console.error('')
    console.error(
      'See scripts/__tests__/helpers/routing-contract.ts for the rules.'
    )
    process.exit(1)
  }

  console.log('verify-dist: OK')
}

if (require.main === module) {
  main(process.argv[2] || 'dist')
}
