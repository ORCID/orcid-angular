/**
 * Translates src/assets/print-view/fetch-orcid.js for every locale produced by
 * `ng build --localize` and writes the result to dist/<locale>/print-view/fetch-orcid.js.
 *
 * This is required because Angular's `scripts` bundle entries do not run through
 * the @angular/localize inlining pass.  Instead, we use Babel +
 * makeEs2015TranslatePlugin to perform the same substitution here.
 *
 * Special cases:
 *  - `en` (source locale): $localize calls are replaced with their English source text.
 *  - Locales whose XLF filename differs from the folder name (pl→pl_PL, tr→tr_TR,
 *    zh-CN→zh_CN, zh-TW→zh_TW) are handled via XLF_LOCALE_MAP.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  makeEs2015TranslatePlugin,
  Xliff1TranslationParser,
  Diagnostics,
} from '@angular/localize/tools'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const babel = require('@babel/core')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require('glob')

/** Maps Angular locale folder name → XLF filename suffix when they differ. */
const XLF_LOCALE_MAP: Record<string, string> = {
  pl: 'pl_PL',
  tr: 'tr_TR',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  src: 'source',
}

/** Source file (pre-translation). */
const PRINT_VIEW_SOURCE = './src/assets/print-view/fetch-orcid.js'

function xlfFileForLocale(locale: string): string {
  const suffix = XLF_LOCALE_MAP[locale] ?? locale
  return `./src/locale/messages.${suffix}.xlf`
}

function getTranslations(locale: string): Record<string, any> | null {
  const xlf = xlfFileForLocale(locale)
  if (!existsSync(xlf)) {
    return null
  }
  const content = readFileSync(xlf, 'utf8')
  const parser = new Xliff1TranslationParser()
  const analyzed = (parser as any).analyze(xlf, content) as {
    canParse: boolean
    hint: any
  }
  if (!analyzed.canParse) {
    console.warn(
      `[print-view-localize] Could not parse XLF for locale "${locale}": ${xlf}`
    )
    return null
  }
  const { translations } = parser.parse(xlf, content, analyzed.hint)
  return translations
}

export function localizeAndWritePrintViewScript(): void {
  const source = readFileSync(PRINT_VIEW_SOURCE, 'utf8')

  // Process every dist locale folder (index.html is the canonical indicator
  // that the folder is a locale build output).
  const indexFiles: string[] = glob.sync('./dist/*/index.html')

  for (const indexFile of indexFiles) {
    const localeFolderSegments = indexFile.split('/')
    // indexFile pattern: ./dist/<locale>/index.html
    const locale = localeFolderSegments[2]
    const localeFolder = localeFolderSegments.slice(0, 3).join('/')
    const destDir = `${localeFolder}/print-view`
    const destFile = `${destDir}/fetch-orcid.js`

    let output: string

    if (locale === 'share-assets') {
      // Not a locale folder — skip.
      continue
    }

    const translations = getTranslations(locale)

    if (!translations) {
      // No XLF for this locale (includes 'en' which is the source locale):
      // inline the source strings via Babel using an empty translation map and
      // missingTranslation:'ignore' so the source text is used as the fallback.
      const diagnostics = new Diagnostics()
      const result = babel.transformSync(source, {
        filename: PRINT_VIEW_SOURCE,
        plugins: [
          makeEs2015TranslatePlugin(
            diagnostics,
            {},
            {
              missingTranslation: 'ignore',
            }
          ),
        ],
        configFile: false,
        babelrc: false,
      })
      output = result?.code ?? source
    } else {
      const diagnostics = new Diagnostics()
      const result = babel.transformSync(source, {
        filename: PRINT_VIEW_SOURCE,
        plugins: [
          makeEs2015TranslatePlugin(diagnostics, translations, {
            missingTranslation: 'warning',
          }),
        ],
        configFile: false,
        babelrc: false,
      })

      if (diagnostics.hasErrors) {
        console.warn(
          `[print-view-localize] Errors for locale "${locale}":`,
          diagnostics.messages
        )
      }

      output = result?.code ?? source
    }

    writeFileSync(destFile, output, 'utf8')
    console.log(`[print-view-localize] ✓ ${destFile}`)

    // Fix the lang attribute in the copied print-view/index.html.
    // The source file always has lang="en"; we rewrite it to the actual locale.
    const printViewIndexPath = `${destDir}/index.html`
    if (existsSync(printViewIndexPath)) {
      const htmlSource = readFileSync(printViewIndexPath, 'utf8')
      const htmlLocalized = htmlSource.replace(
        /<html([^>]*)lang="[^"]*"/,
        `<html$1lang="${locale}"`
      )
      if (htmlLocalized !== htmlSource) {
        writeFileSync(printViewIndexPath, htmlLocalized, 'utf8')
        console.log(
          `[print-view-localize] ✓ ${printViewIndexPath} (lang=${locale})`
        )
      }
    }
  }
}
