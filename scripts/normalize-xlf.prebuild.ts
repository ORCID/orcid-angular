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

interface PrintViewUnit {
  id: string
  source: string
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
    // Convert $localize template placeholders `${expression}:NAME:` into the
    // canonical $localize message form `{$NAME}` so the XLF source matches the
    // runtime message and stays stable regardless of the JS expression.
    const source = normalizeText(
      rawSource.replace(/\$\{[^}]*\}:([A-Z0-9_]+):/g, '{$$$1}')
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

    transUnits.forEach((tu) => {
      // Provide a stable key for Transifex (some parsers rely on resname over id/source)
      if (tu?.$?.id) {
        tu.$.resname = tu.$.id
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
    const printViewUnits = parsePrintViewUnits(PRINT_VIEW_SOURCE_FILE)
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
