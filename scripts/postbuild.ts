// Turns the raw `ng build --localize` output into the tree production serves.
//
// The deployed contract, and what each step below exists for, is documented in
// scripts/__tests__/helpers/routing-contract.ts. In short: locale directories
// must be named so the Tomcat rewrite valve matches them, every asset must sit
// flat in share-assets so the nginx asset route finds it, and each locale needs
// its OWN URL for its copy of a bundle because Cloudflare caches on the URL
// alone with no cookie in the key.
//
// `yarn test:scripts` characterizes all of it.

import { buildInfo } from './build-info.postbuild'
import { getOptionsObjet, save } from './utils'
import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { basename, dirname, join } from 'path'
import { createShareAssetsFolder } from './moveToShareFolder.postbuild'
import { addOneTrustNotAutoBlockForAppScripts } from './onetrust.postbuild'
import { newRelic } from './new-relic.postbuild'
import { localizeAndWritePrintViewScript } from './print-view-localize.postbuild'
import { isLocaleIndexFile } from './dist-layout'

const glob = require('glob')

if (existsSync('./dist/browser')) {
  throw new Error(
    'postbuild: found ./dist/browser. angular.json must set ' +
      'outputPath.browser to "" so locales stay at ./dist/<locale>/; every glob ' +
      'here and the locale derivation in utils.ts depend on that depth.'
  )
}

/** `./dist/<locale>/index.html` for each real locale. */
const localeIndexFiles: string[] = glob
  .sync('./dist/*/index.html')
  .filter(isLocaleIndexFile)

if (localeIndexFiles.length === 0) {
  throw new Error(
    'postbuild: no ./dist/<locale>/index.html found. Did `ng build` run, and ' +
      'did it write to ./dist? Silently doing nothing here would ship an empty WAR.'
  )
}

// ---------------------------------------------------------------------------
// 1. index.html rewrites
// ---------------------------------------------------------------------------

localeIndexFiles.forEach((file) => {
  const options = getOptionsObjet(file)
  let data = readFileSync(file, 'utf8')

  // Appends `<!--<locale> <date>-->`. monit greps /reset-password for the
  // literal `--fr`, which is the opening of that comment, so it must stay.
  data = buildInfo(data, options)

  // Writes dist/<locale>/new-relic.runtime.<hash>.js and injects a tag that
  // already carries the `-<locale>` suffix; step 2 renames the file to match.
  data = newRelic(data, options)

  data = addOneTrustNotAutoBlockForAppScripts(data)

  // data = robotsMetadata(data, options) DISABLE robots headers, as those will be handle via nginx
  save(data, options)
})

// ---------------------------------------------------------------------------
// 2. Give every locale its own filenames
// ---------------------------------------------------------------------------
//
// `main-<hash>.js` becomes `main-<hash>-fr.js`, and every reference to it is
// rewritten to match. All 21 locales are flattened into one share-assets
// directory, and the esbuild hash is computed BEFORE translations are inlined,
// so without this every locale would emit the same filename with different
// bytes and the last one written would win for every visitor.
//
// This replaces two older passes: a regex over `src="<name>.<16 hex>` in
// index.html, and a rewrite of the webpack runtime chunk manifest. The esbuild
// builder emits no runtime chunk; lazy chunks are quoted ESM specifiers
// (`import("./chunk-XXXXXXXX.js")`) inside the emitted modules, and index.html
// preloads them as bare `href="chunk-XXXXXXXX.js"`. Rewriting the exact quoted
// filename covers both spellings and both bundlers.

localeIndexFiles.forEach((indexFile) => {
  const localeDir = dirname(indexFile)
  const locale = getOptionsObjet(indexFile).languageCode

  // Only files directly in the locale directory. print-view/ keeps its stable
  // names: nginx routes /print-view/ with an `^~` prefix location that beats
  // the asset regex, and the URLs inside it are hardcoded.
  const renames = new Map<string, string>()
  for (const entry of readdirSync(localeDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) {
      continue
    }
    if (entry.name.endsWith(`-${locale}.js`)) {
      continue // already suffixed (new-relic writes its own name)
    }
    renames.set(entry.name, entry.name.replace(/\.js$/, `-${locale}.js`))
  }

  if (renames.size === 0) {
    return
  }

  // Rewrite references before renaming, so a partial failure leaves the tree
  // internally consistent rather than pointing at files that no longer exist.
  //
  // Every .js in the directory is rewritten, not just the ones being renamed:
  // an already-suffixed file (new-relic writes its own name) can still import a
  // file that IS being renamed, and skipping it would leave a dangling
  // specifier that nothing reports.
  const filesToRewrite = [
    indexFile,
    ...readdirSync(localeDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
      .map((entry) => join(localeDir, entry.name)),
  ]

  for (const file of filesToRewrite) {
    const before = readFileSync(file, 'utf8')
    let after = before
    for (const [oldName, newName] of renames) {
      // Exact quoted forms only. These are content-hashed names, so they never
      // occur as an accidental substring, and matching the quotes keeps the
      // replacement from touching a longer name that contains this one.
      after = after
        .split(`"${oldName}"`)
        .join(`"${newName}"`)
        .split(`'${oldName}'`)
        .join(`'${newName}'`)
        .split(`"./${oldName}"`)
        .join(`"./${newName}"`)
        .split(`'./${oldName}'`)
        .join(`'./${newName}'`)
        // Only emitted when sourceMaps are on, which production does not use.
        .split(`sourceMappingURL=${oldName}.map`)
        .join(`sourceMappingURL=${newName}.map`)
    }
    if (after !== before) {
      writeFileSync(file, after, 'utf8')
    }
  }

  for (const [oldName, newName] of renames) {
    renameSync(join(localeDir, oldName), join(localeDir, newName))
    const oldMap = join(localeDir, `${oldName}.map`)
    if (existsSync(oldMap)) {
      renameSync(oldMap, join(localeDir, `${newName}.map`))
    }
  }
})

// ---------------------------------------------------------------------------
// 3. Print view
// ---------------------------------------------------------------------------
//
// fetch-orcid.js is a plain asset, not part of the Angular compilation, so the
// build never inlines its $localize calls. Do it here, per locale.
localizeAndWritePrintViewScript()

// ---------------------------------------------------------------------------
// 4. Tidy up build artifacts that are not part of the deployed tree
// ---------------------------------------------------------------------------
//
// With outputPath.browser set to "", the application builder writes these at
// the dist root rather than inside each locale. The WAR copies dist/ verbatim,
// so leaving them would add files to the served root that were never there
// under webpack. 3rdpartylicenses.txt belongs with the bundles it documents;
// prerendered-routes.json is always emitted and is empty because nothing here
// prerenders.
const licenses = './dist/3rdpartylicenses.txt'
if (existsSync(licenses)) {
  const anyLocale = localeIndexFiles[0]
  if (anyLocale) {
    renameSync(licenses, join(dirname(anyLocale), basename(licenses)))
  }
}

const prerenderedRoutes = './dist/prerendered-routes.json'
if (existsSync(prerenderedRoutes)) {
  unlinkSync(prerenderedRoutes)
}

// ---------------------------------------------------------------------------
// 5. zh-CN -> zh_CN
// ---------------------------------------------------------------------------
//
// The Tomcat rewrite valve matches ^/orcid-web-frontend/([a-z]{2}(_[A-Za-z]{2})?)/
// so a hyphen would break the SPA fallback for every Chinese deep link. The
// nginx cookie map already translates the `zh-CN` cookie value to this folder.
// Note this runs AFTER the renaming above, so bundles inside dist/zh_CN keep
// the `-zh-CN` suffix they were stamped with. That asymmetry is intentional and
// is what production serves.
localeIndexFiles.forEach((file) => {
  const options = getOptionsObjet(file)
  renameSync(options.folder, options.folder.replace('-', '_'))
})

// ---------------------------------------------------------------------------
// 6. Flatten every asset into share-assets
// ---------------------------------------------------------------------------
//
// index.html carries <base href="/">, so the browser requests bundles at the
// site root and nginx sends single-segment asset URLs to share-assets.
createShareAssetsFolder()
