import * as fs from 'fs'
import { parseString, Builder } from 'xml2js'

function normalizeText(input: string): string {
  return input
    .replace(/\r/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
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

    const builder = new Builder()
    let out = builder.buildObject(data)
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
    fs.writeFileSync(path, out, { encoding: 'utf8' })
  })
}

normalizeXlf12Sources('./src/locale/messages.xlf')


