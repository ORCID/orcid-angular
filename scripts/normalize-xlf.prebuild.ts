import * as fs from 'fs'
import { parseString, Builder } from 'xml2js'

const TEST_LANGUAGES = [
  { code: 'xx', target: 'X' },
  { code: 'lr', target: 'LR' },
  { code: 'rl', target: 'RL' },
]

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

    writeXlf(path, data)
    generateTestingLanguages(data)
  })
}

normalizeXlf12Sources('./src/locale/messages.xlf')
