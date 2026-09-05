/**
 * Characterization tests for `scripts/postbuild.ts`.
 *
 * postbuild is the only thing that turns raw `ng build --localize` output into
 * the layout production actually serves. Nothing else tests it, and the shape
 * it produces is depended on by four systems outside this repo:
 *
 *   - the WAR (pom.xml copies dist/ verbatim to context /orcid-web-frontend)
 *   - a Tomcat rewrite valve that only recognises 2-letter locale directories
 *   - two nginx layers that route flat, single-segment asset URLs to
 *     share-assets and locale-scoped page URLs to dist/<locale>/index.html
 *   - Cloudflare, which caches every asset by URL alone with no cookie in the
 *     key, so each locale's copy of a file must have a distinct URL
 *
 * The assertions are split in two. GROUP A is the deployed contract: it holds
 * regardless of which bundler produced the input, which is what made the move
 * from the webpack browser builder to the esbuild application builder safe to
 * attempt. GROUP B covers what is specific to the current bundler's output.
 *
 * The fixture is copied into a throwaway workspace and the REAL postbuild is
 * spawned against it, so this exercises production code with no refactor.
 *
 * Run: yarn test:scripts        Re-record goldens: yarn test:scripts:update
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'fs'
import * as path from 'path'

import {
  REPO_ROOT,
  createWorkspace,
  runPostbuild,
  cleanupWorkspace,
  listFiles,
  listDirs,
  readText,
  exists,
} from './helpers/workspace'
import {
  LOCALE_DIR_RE,
  UNROUTABLE_LOCALE_DIRS,
  matchesProdAssetRoute,
  matchesDevAssetRoute,
} from './helpers/routing-contract'
import { buildManifest } from './helpers/layout-manifest'

const GOLDEN_DIR = path.join(REPO_ROOT, 'scripts/__fixtures__/golden')
const UPDATE_GOLDEN = process.env.UPDATE_GOLDEN === '1'

/**
 * Locales present in every fixture.
 *
 * `dir` is the directory name after postbuild; `suffix` is what the bundles for
 * that locale are tagged with. They differ for Chinese, and that asymmetry is
 * real and load-bearing: steps 1-2 stamp filenames using the directory name
 * Angular emitted (`zh-CN`), and only step 5 renames the directory itself to
 * `zh_CN` for the Tomcat rewrite valve. So production really does serve
 * `/orcid-web-frontend/zh_CN/index.html` referencing `/main.<hash>-zh-CN.js`.
 *
 * `src` is 3 letters and therefore unroutable (see UNROUTABLE_LOCALE_DIRS).
 */
const FIXTURE_LOCALES = [
  { dir: 'en', suffix: 'en' },
  { dir: 'fr', suffix: 'fr' },
  { dir: 'zh_CN', suffix: 'zh-CN' },
  { dir: 'src', suffix: 'src' },
]

const LOCALE_DIRS = FIXTURE_LOCALES.map((l) => l.dir)
const BUNDLE_SUFFIXES = FIXTURE_LOCALES.map((l) => l.suffix)

/** Splits `main.<hash>-zh-CN.js` into its base and its locale suffix. Matching
 *  against the known suffixes rather than a regex avoids mis-reading a hyphen
 *  inside the locale code as the separator. */
function splitLocaleSuffix(
  file: string
): { base: string; suffix: string } | null {
  for (const suffix of BUNDLE_SUFFIXES) {
    if (file.endsWith(`-${suffix}.js`)) {
      return { base: file.slice(0, -`-${suffix}.js`.length), suffix }
    }
  }
  return null
}

/**
 * A miniature of what `ng build --localize` emits: four locales sharing the same
 * hashed filenames with different contents, plus the root-level artifacts the
 * application builder writes alongside them.
 */
const FIXTURES = [
  { name: 'dist-esbuild', golden: 'postbuild-esbuild.manifest.json' },
]

/** Reference values a page can legitimately carry that are not asset requests. */
function isNotAnAssetRef(ref: string): boolean {
  return (
    ref.startsWith('http://') ||
    ref.startsWith('https://') ||
    ref.startsWith('//') ||
    ref.startsWith('data:') ||
    ref.startsWith('#') ||
    ref.startsWith('mailto:') ||
    // `<base href="/">`
    ref === '/' ||
    // assets are copied verbatim into share-assets/assets and reached via
    // the /assets/** route, which does allow multiple segments
    ref.startsWith('./assets/') ||
    ref.startsWith('/assets/') ||
    ref.startsWith('assets/')
  )
}

/** Every URL an index.html or a stylesheet asks the browser to fetch. */
function assetRefs(html: string): string[] {
  const refs = new Set<string>()
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1])
  for (const m of html.matchAll(/url\(([^)]+)\)/g))
    refs.add(m[1].trim().replace(/^['"]|['"]$/g, ''))
  return [...refs].filter((r) => !isNotAnAssetRef(r))
}

function compareGolden(name: string, actual: Record<string, number>): void {
  const file = path.join(GOLDEN_DIR, name)

  if (UPDATE_GOLDEN || !fs.existsSync(file)) {
    fs.mkdirSync(GOLDEN_DIR, { recursive: true })
    fs.writeFileSync(file, JSON.stringify(actual, null, 2) + '\n')
    if (!UPDATE_GOLDEN) {
      console.log(
        `  (recorded new golden ${name}; commit it and review the diff)`
      )
    }
    return
  }

  const expected = JSON.parse(fs.readFileSync(file, 'utf8'))
  const keys = [
    ...new Set([...Object.keys(expected), ...Object.keys(actual)]),
  ].sort()
  const diffs = keys
    .filter((k) => expected[k] !== actual[k])
    .map((k) =>
      expected[k] === undefined
        ? `+ ${k} (${actual[k]})`
        : actual[k] === undefined
        ? `- ${k} (${expected[k]})`
        : `~ ${k} (${expected[k]} -> ${actual[k]})`
    )

  assert.deepEqual(
    diffs,
    [],
    `Deployed layout changed vs ${name}.\n${diffs.join('\n')}\n\n` +
      `Every line here is a change production will see. If it is intended, ` +
      `re-record with: yarn test:scripts:update`
  )
}

for (const fixture of FIXTURES) {
  const fixtureDir = path.join(REPO_ROOT, 'scripts/__fixtures__', fixture.name)
  const present = fs.existsSync(fixtureDir)

  describe(
    `postbuild against ${fixture.name}`,
    { skip: present ? false : `fixture ${fixture.name} not present yet` },
    () => {
      let ws: string
      let dist: string

      before(() => {
        ws = createWorkspace(fixture.name)
        dist = path.join(ws, 'dist')
        runPostbuild(ws)
      })

      after(() => {
        if (ws) cleanupWorkspace(ws)
      })

      // ---------------------------------------------------------------- GROUP A
      // The deployed contract. Must hold for any bundler.

      it('emits an index.html for every locale, with zh-CN renamed to zh_CN', () => {
        for (const { dir } of FIXTURE_LOCALES) {
          assert.ok(
            exists(path.join(dist, dir, 'index.html')),
            `dist/${dir}/index.html is missing`
          )
        }
        // The Tomcat rewrite valve matches [a-z]{2}(_[A-Za-z]{2})?, so a hyphen
        // would make every deep link in Chinese 404.
        assert.ok(
          !exists(path.join(dist, 'zh-CN')),
          'dist/zh-CN must be renamed to zh_CN'
        )
      })

      it('names locale directories so the Tomcat rewrite valve can match them', () => {
        const offenders = listDirs(dist)
          .filter((d) => d !== 'share-assets')
          .filter((d) => !LOCALE_DIR_RE.test(d))
          .filter((d) => !UNROUTABLE_LOCALE_DIRS.includes(d))

        assert.deepEqual(
          offenders,
          [],
          'These locale directories cannot be reached through the SPA fallback ' +
            '(RewriteRule ^/orcid-web-frontend/([a-z]{2}(_[A-Za-z]{2})?)/.*). ' +
            'Add to UNROUTABLE_LOCALE_DIRS only if that is deliberate.'
        )
      })

      it('references only files that exist, flat in share-assets', () => {
        const shareAssets = new Set(listFiles(path.join(dist, 'share-assets')))

        for (const { dir } of FIXTURE_LOCALES) {
          const html = readText(path.join(dist, dir, 'index.html'))
          for (const ref of assetRefs(html)) {
            assert.ok(
              !ref.includes('/'),
              `dist/${dir}/index.html asks for "${ref}". With <base href="/"> the ` +
                `browser requests a root path, and only single-segment asset URLs are ` +
                `routed to share-assets; anything deeper falls through to the Java app.`
            )
            assert.ok(
              shareAssets.has(ref),
              `dist/${dir}/index.html references "${ref}", which is not in share-assets`
            )
          }
        }
      })

      it('references only URLs the production nginx asset route matches', () => {
        for (const { dir } of FIXTURE_LOCALES) {
          const html = readText(path.join(dist, dir, 'index.html'))
          for (const ref of assetRefs(html)) {
            assert.ok(
              matchesProdAssetRoute('/' + ref),
              `"/${ref}" is not matched by the production asset route, so nginx would ` +
                `send it to /orcid-web (the Java app) instead of share-assets.`
            )
          }
        }
      })

      it('reports which referenced URLs the dev/int/stage proxies cannot route', () => {
        // Not a failure: prod/qa/sbox allow .webp, the dev proxy and the int and
        // stage inventories do not. Surfaced so the gap stays visible and so a
        // NEW unroutable extension is noticed.
        const unroutable = new Set<string>()
        for (const { dir } of FIXTURE_LOCALES) {
          for (const ref of assetRefs(
            readText(path.join(dist, dir, 'index.html'))
          )) {
            if (!matchesDevAssetRoute('/' + ref)) unroutable.add(ref)
          }
        }
        const exts = [
          ...new Set([...unroutable].map((f) => path.extname(f))),
        ].sort()
        assert.deepEqual(
          exts.filter((e) => e !== '.webp'),
          [],
          `New file extensions that prod routes but dev/int/stage do not: ${exts.join(
            ', '
          )}. ` +
            `Either add them to the asset regex in those nginx templates or stop shipping them.`
        )
        if (unroutable.size > 0) {
          console.log(
            `  note: ${unroutable.size} .webp reference(s) are unroutable on dev/int/stage ` +
              `(pre-existing: their asset regex lacks .webp)`
          )
        }
      })

      it('leaves nothing but index.html and print-view inside a locale directory', () => {
        for (const { dir } of FIXTURE_LOCALES) {
          const stray = listFiles(path.join(dist, dir)).filter(
            (f) => f !== 'index.html' && !f.startsWith('print-view/')
          )
          assert.deepEqual(
            stray,
            [],
            `dist/${dir} still holds ${stray.join(
              ', '
            )}. Anything left behind is ` +
              `served from a locale path that nginx only routes to index.html.`
          )
        }
      })

      it('gives every locale its own copy of each JS bundle, with distinct content', () => {
        // Cloudflare caches by URL with no cookie in the key. If two locales
        // shared a filename, whichever was written last would be served to
        // everyone, in the wrong language.
        const jsFiles = listFiles(path.join(dist, 'share-assets')).filter(
          (f) => f.endsWith('.js') && !f.includes('/')
        )
        assert.ok(jsFiles.length > 0, 'share-assets holds no JS at all')

        const byBase = new Map<string, string[]>()
        for (const f of jsFiles) {
          const split = splitLocaleSuffix(f)
          assert.ok(
            split,
            `share-assets/${f} carries no known locale suffix ` +
              `(expected one of ${BUNDLE_SUFFIXES.join(
                ', '
              )}). An unsuffixed bundle ` +
              `would be shared across locales by Cloudflare's URL-keyed cache.`
          )
          byBase.set(split!.base, [...(byBase.get(split!.base) || []), f])
        }

        for (const [base, files] of byBase) {
          assert.equal(
            files.length,
            FIXTURE_LOCALES.length,
            `${base} has ${files.length} locale copies, expected ${FIXTURE_LOCALES.length}: ${files}`
          )
          const contents = files.map((f) =>
            readText(path.join(dist, 'share-assets', f))
          )

          // Content distinctness is only meaningful for bundles that carry
          // translated code. `new-relic.runtime.<hash>-<locale>.js` is a verbatim
          // copy of scripts/new-relic.runtime.js and is byte-identical in every
          // locale in the real build too; it still needs its own URL per locale
          // because share-assets is a single flat namespace. The fixture stamps
          // every localized bundle with a LOCALE: marker, so keying off that
          // keeps the check honest without hardcoding an exemption list.
          const localized = contents.filter((c) => c.includes('LOCALE:'))
          if (localized.length > 0) {
            assert.equal(
              localized.length,
              contents.length,
              `${base} is localized in some locales but not others`
            )
            assert.equal(
              new Set(contents).size,
              contents.length,
              `Two locales produced byte-identical ${base}. Cloudflare keys its ` +
                `cache on the URL alone, so whichever was written last would be ` +
                `served to everyone, in the wrong language.`
            )
          }
        }
      })

      it('keeps the stylesheet shared and unsuffixed', () => {
        // CSS carries no translated text, so one copy serves every locale.
        const css = listFiles(path.join(dist, 'share-assets')).filter(
          (f) => f.endsWith('.css') && !f.includes('/')
        )
        assert.equal(
          css.length,
          1,
          `expected exactly one shared stylesheet, got ${css}`
        )
        for (const suffix of BUNDLE_SUFFIXES) {
          assert.ok(
            !css[0].endsWith(`-${suffix}.css`),
            `${css[0]} is locale-suffixed; it should be shared`
          )
        }
      })

      it('copies share-assets/assets from en and removes the per-locale copies', () => {
        const shared = listFiles(path.join(dist, 'share-assets/assets'))
        assert.ok(shared.length > 0, 'share-assets/assets is empty')

        // en is the source of truth for assets; the marker file proves the copy
        // came from en rather than being merged across locales.
        assert.ok(
          shared.includes('en-only.txt'),
          'share-assets/assets was not copied from dist/en (en-only.txt is missing)'
        )
        for (const dir of LOCALE_DIRS) {
          assert.ok(
            !exists(path.join(dist, dir, 'assets')),
            `dist/${dir}/assets survived; only share-assets/assets should remain`
          )
        }
      })

      it('injects the New Relic script and marks every script for OneTrust', () => {
        const newRelicSource = readText(
          path.join(REPO_ROOT, 'scripts/new-relic.runtime.js')
        )

        for (const { dir } of FIXTURE_LOCALES) {
          const html = readText(path.join(dist, dir, 'index.html'))
          assert.ok(
            !html.includes('NEW_RELIC_PLACEHOLDER'),
            `dist/${dir}/index.html still has the placeholder comment`
          )

          const injected = html.match(/src="(new-relic\.runtime\.[^"]+)"/)
          assert.ok(
            injected,
            `dist/${dir}/index.html has no New Relic script tag`
          )
          const file = path.join(dist, 'share-assets', injected![1])
          assert.ok(
            exists(file),
            `${injected![1]} was referenced but not emitted`
          )
          assert.equal(
            readText(file),
            newRelicSource,
            'the emitted New Relic runtime does not match scripts/new-relic.runtime.js'
          )

          // OneTrust must not auto-block our own scripts.
          const scriptTags = html.match(/<script\b[^>]*>/g) || []
          const unmarked = scriptTags.filter(
            (t) => !t.includes('data-ot-ignore')
          )
          assert.deepEqual(
            unmarked,
            [],
            `dist/${dir}/index.html has script tags without data-ot-ignore: ${unmarked}`
          )
        }
      })

      it('stamps the build-info comment monit health-checks on', () => {
        for (const { dir, suffix } of FIXTURE_LOCALES) {
          const html = readText(path.join(dist, dir, 'index.html'))
          // The comment is stamped in step 1, before the zh-CN -> zh_CN rename,
          // so it carries the locale Angular emitted, not the final directory
          // name. It also spans two lines, hence the `s` flag rather than `[^>]*`.
          assert.match(
            html,
            new RegExp(`<!--${suffix}\\s[\\s\\S]*?-->`),
            `dist/${dir}/index.html has no build-info comment for "${suffix}"`
          )
        }

        // monit (inventory .../monit/conf.d/reg-ui-1.j2) fetches /reset-password
        // with `Cookie: locale_v3=fr` and requires the body to contain the literal
        // `--fr`. That substring is the opening of the comment above: `<!--fr `.
        // Nothing else in the page provides it, so dropping or renaming the
        // comment silently flaps the service in production.
        assert.ok(
          readText(path.join(dist, 'fr', 'index.html')).includes('--fr'),
          "dist/fr/index.html no longer contains '--fr', which the monit health check greps for"
        )
      })

      it('localizes the print view per locale', () => {
        for (const { dir, suffix } of FIXTURE_LOCALES) {
          const js = readText(path.join(dist, dir, 'print-view/fetch-orcid.js'))
          // Every tagged-template call must be gone. The file still MENTIONS
          // $localize in its no-op shim (`if (typeof $localize === 'undefined')`),
          // which is deliberate and ships to production, so only the call form is
          // asserted on.
          assert.equal(
            js.match(/\$localize\s*`/g),
            null,
            `dist/${dir}/print-view/fetch-orcid.js still has $localize template ` +
              `calls; the Babel inlining did not run for this locale`
          )

          const html = readText(path.join(dist, dir, 'print-view/index.html'))
          assert.ok(
            !html.includes('__PRINT_VIEW_VERSION__'),
            `dist/${dir}/print-view/index.html still has the version placeholder`
          )
          // Set before the zh-CN -> zh_CN rename, so it is the emitted locale.
          assert.match(
            html,
            new RegExp(`<html[^>]*lang="${suffix}"`),
            `dist/${dir}/print-view/index.html has the wrong lang attribute`
          )
          assert.match(
            html,
            /\?v=[0-9a-f]{8}-/,
            `dist/${dir}/print-view/index.html has no cache-busting version`
          )
        }

        // Spot-check that a real translation was substituted, not just that
        // $localize disappeared.
        assert.ok(
          readText(path.join(dist, 'fr', 'print-view/fetch-orcid.js')).includes(
            'Biographie'
          ),
          'the French print view was not translated'
        )
        for (const sourceLocale of ['en', 'src']) {
          assert.ok(
            readText(
              path.join(dist, sourceLocale, 'print-view/fetch-orcid.js')
            ).includes('Biography'),
            `the ${sourceLocale} print view lost its English source text`
          )
        }
      })

      it('matches the recorded layout', () => {
        compareGolden(fixture.golden, buildManifest(dist))
      })

      // ---------------------------------------------------------------- GROUP B
      // Bundler-specific characterization.

      it('resolves every chunk reference embedded in emitted JS', () => {
        // esbuild has no runtime manifest: lazy chunks are plain quoted ESM
        // specifiers inside main/chunk files, so the suffixing has to rewrite
        // them in place.
        const dir = path.join(dist, 'share-assets')
        const files = listFiles(dir).filter(
          (f) => f.endsWith('.js') && !f.includes('/')
        )
        const present = new Set(files)

        for (const file of files) {
          const locale = file.match(/-([A-Za-z_]+)\.js$/)?.[1]
          if (!locale) continue
          const src = readText(path.join(dir, file))
          for (const m of src.matchAll(
            /["'](?:\.\/)?((?:chunk|main|polyfills|scripts)-[^"'/]+\.js)["']/g
          )) {
            assert.ok(
              present.has(m[1]),
              `share-assets/${file} imports "${m[1]}", which does not exist. ` +
                `The locale suffixing must rewrite import specifiers too.`
            )
            assert.ok(
              m[1].endsWith(`-${locale}.js`),
              `share-assets/${file} (locale ${locale}) imports "${m[1]}" from another locale`
            )
          }
        }
      })
    }
  )
}
