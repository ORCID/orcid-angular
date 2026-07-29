import * as fs from 'fs'
import { parseString, Builder } from 'xml2js'

const TEST_LANGUAGES = [
  { code: 'xx', target: 'X' },
  { code: 'lr', target: 'LR' },
  { code: 'rl', target: 'RL' },
]

// Path to the standalone print-view script. Its $localize strings are NOT
// picked up by `ng extract-i18n` (the file is a plain asset, not part of the
// Angular compilation), so we parse them out here and inject them into the
// XLF. Parsing the file directly keeps fetch-orcid.js as the single source of
// truth: strings added/removed there propagate automatically, with no
// hardcoded list to drift out of sync.
const PRINT_VIEW_SOURCE_FILE = './src/assets/print-view/fetch-orcid.js'

// Sentinels used to carry XLIFF <x/> placeholder elements through the xml2js
// Builder, which escapes any markup it finds in a text node. We emit the
// sentinels as plain text and swap them for real elements in formatXmlOutput().
const PH_START = '@@XPH_START@@'
const PH_MID = '@@XPH_MID@@'
const PH_END = '@@XPH_END@@'

// Matches a $localize template placeholder: `${expression}:NAME:`.
// NAME deliberately accepts any case: fetch-orcid.js uses camelCase names, and
// $localize matches placeholder names verbatim.
const LOCALIZE_PLACEHOLDER_RE = /\$\{([^}]*)\}:([A-Za-z0-9_]+):/g

// Non-global twin of the above, for stateless `.test()` checks (a shared /g
// regex carries lastIndex between calls).
const HAS_LOCALIZE_PLACEHOLDER_RE = new RegExp(LOCALIZE_PLACEHOLDER_RE.source)

interface PrintViewUnit {
  id: string
  source: string
}

function escapeXmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parsePrintViewUnits(path: string): PrintViewUnit[] {
  const js = fs.readFileSync(path, 'utf8')
  // Matches $localize tagged templates of the form `:@@printView.someId:Source text`
  const re = /:@@(printView\.[A-Za-z0-9_]+):([^`]*)`/g
  const units: PrintViewUnit[] = []
  const seen = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = re.exec(js)) !== null) {
    const [, id, rawSource] = match
    if (seen.has(id)) {
      continue
    }
    seen.add(id)
    // Convert $localize template placeholders `${expression}:NAME:` into XLIFF
    // <x id="NAME"/> elements (emitted as sentinels here, see formatXmlOutput).
    // Plain-text forms such as `{$NAME}` do NOT work: Xliff1TranslationParser
    // only recognises real <x/> elements, so a text placeholder is parsed as
    // literal content and the message ends up with zero placeholders — the
    // translation is then silently truncated at the first `$`.
    const source = normalizeText(
      rawSource.replace(
        LOCALIZE_PLACEHOLDER_RE,
        (_match, expression: string, name: string) =>
          `${PH_START}${name}${PH_MID}\${${expression}}${PH_END}`
      )
    )
    units.push({ id, source })
  }
  return units
}

function normalizeText(input: string): string {
  return input
    .replace(/\r/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
}

function formatXmlOutput(xml: string): string {
  let out = xml
  // Restore XLIFF placeholder elements that were emitted as sentinels so the
  // xml2js Builder would not escape them into plain text.
  out = out.replace(
    new RegExp(`${PH_START}(.*?)${PH_MID}(.*?)${PH_END}`, 'g'),
    (_match, name: string, equivText: string) =>
      `<x id="${name}" equiv-text="${escapeXmlAttr(equivText)}"/>`
  )
  // Match tx pull header formatting (xml decl + <xliff ...> on same line)
  out = out.replace(
    /<xliff[^>]*>/,
    '<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">'
  )
  out = out.replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" ?>')
  out = out.replace(
    /^<\?xml version="1\.0" \?>\s*\n\s*<xliff/,
    '<?xml version="1.0" ?><xliff'
  )
  return out
}

function writeXlf(path: string, data: unknown) {
  const builder = new Builder()
  const xml = builder.buildObject(data)
  const out = formatXmlOutput(xml)
  fs.writeFileSync(path, out, { encoding: 'utf8' })
}

function generateTestingLanguages(baseData: any) {
  const fileNode = baseData?.xliff?.file?.[0]
  const transUnits = fileNode?.body?.[0]?.['trans-unit']

  if (!Array.isArray(transUnits)) {
    throw new Error('No trans-units found in XLF 1.2 file')
  }

  TEST_LANGUAGES.forEach(({ code, target }) => {
    const data = JSON.parse(JSON.stringify(baseData))
    const langFileNode = data?.xliff?.file?.[0]
    if (!langFileNode?.$) {
      langFileNode.$ = {}
    }
    langFileNode.$['target-language'] = code
    const langTransUnits = langFileNode?.body?.[0]?.['trans-unit'] ?? []
    langTransUnits.forEach((tu: any) => {
      tu.target = [target]
    })
    writeXlf(`./src/locale/messages.${code}.xlf`, data)
  })
}

/** Extracts the ordered <x id="..."/> names inside an XLF element body. */
function placeholderIds(fragment: string): string[] {
  return Array.from(fragment.matchAll(/<x\s+id="([^"]+)"/g)).map((m) => m[1])
}

/**
 * Warns when a translated printView.* target has lost one of the placeholders
 * its source declares.
 *
 * Such a target still inlines cleanly — @angular/localize reports no error — but
 * renders with the value silently dropped, e.g. a peer review count vanishing
 * from the heading. That silence is what let this class of bug ship before, so
 * surface it at build time. Read-only: translations are never rewritten here.
 */
function checkLocalePlaceholders(localeDir: string) {
  const files = fs
    .readdirSync(localeDir)
    .filter((name) => name.startsWith('messages.') && name.endsWith('.xlf'))
    // The generated test languages replace every target with a marker, so their
    // placeholders are legitimately absent.
    .filter(
      (name) =>
        !TEST_LANGUAGES.some(({ code }) => name === `messages.${code}.xlf`)
    )

  files.forEach((name) => {
    const xlf = fs.readFileSync(`${localeDir}/${name}`, 'utf8')

    // Transifex holds the <x/> form of these strings, so a pull should never
    // bring back the legacy `${expression}:name:` text. If it does, the source
    // there has gone stale and every locale would render the heading truncated
    // at the first `$` with no other symptom — fail rather than ship that.
    if (HAS_LOCALIZE_PLACEHOLDER_RE.test(xlf)) {
      throw new Error(
        `[normalize-xlf] ${name} contains legacy raw placeholder syntax ` +
          `(\${expression}:name:). Push the current messages.xlf to Transifex ` +
          `so translations come back with <x id="..."/> placeholders.`
      )
    }

    Array.from(
      xlf.matchAll(/<trans-unit id="(printView\.[^"]*)"[\s\S]*?<\/trans-unit>/g)
    ).forEach(([unit, id]) => {
      const target = unit.match(/<target[^>]*>([\s\S]*?)<\/target>/)
      if (!target) {
        return
      }
      const expected = placeholderIds(
        unit.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? ''
      )
      const actual = placeholderIds(target[1])
      const missing = expected.filter((p) => !actual.includes(p))
      if (missing.length) {
        console.warn(
          `[normalize-xlf] ${name}: "${id}" target is missing placeholder(s) ${missing.join(
            ', '
          )} — their values will be dropped from the rendered string.`
        )
      }
    })
  })
}

function normalizeXlf12Sources(path: string) {
  const xml = fs.readFileSync(path, 'utf8')
  parseString(xml, (error, data) => {
    if (error) {
      throw error
    }

    const fileNode = data?.xliff?.file?.[0]
    const transUnits = fileNode?.body?.[0]?.['trans-unit']

    if (!Array.isArray(transUnits)) {
      throw new Error('No trans-units found in XLF 1.2 file')
    }

    const printViewUnits = parsePrintViewUnits(PRINT_VIEW_SOURCE_FILE)
    const printViewById = new Map(printViewUnits.map((u) => [u.id, u]))

    transUnits.forEach((tu) => {
      // Provide a stable key for Transifex (some parsers rely on resname over id/source)
      if (tu?.$?.id) {
        tu.$.resname = tu.$.id
      }
      const generated = tu?.$?.id ? printViewById.get(tu.$.id) : undefined
      if (generated) {
        // fetch-orcid.js is the source of truth for printView.* units, so
        // always regenerate the source rather than keeping what is on disk.
        // Re-parsing a unit that already contains <x/> elements yields mixed
        // content, which the Builder cannot round-trip; replacing the whole
        // node with a freshly built string keeps placeholders correct.
        tu.source = [generated.source]
        return
      }
      const src = tu?.source?.[0]
      if (typeof src === 'string') {
        tu.source[0] = normalizeText(src)
      }
    })

    // Inject @@printView.* source-only trans-units parsed from the standalone
    // print-view script so the test-language generator (generateTestingLanguages)
    // will also stamp X / LR / RL for these strings, and so Transifex can
    // discover them for real locales. We use a stable @@-prefixed id so
    // $localize can match by explicit id.
    const existingIds = new Set(transUnits.map((tu: any) => tu?.$?.id))
    const printViewBody = fileNode?.body?.[0]
    printViewUnits.forEach(({ id, source }) => {
      if (!existingIds.has(id)) {
        printViewBody['trans-unit'].push({
          $: { id, datatype: 'html', resname: id },
          source: [source],
        })
      }
    })

    writeXlf(path, data)
    generateTestingLanguages(data)
  })
}

normalizeXlf12Sources('./src/locale/messages.xlf')
checkLocalePlaceholders('./src/locale')
