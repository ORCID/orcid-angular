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

    // Inject @@printView.* source-only trans-units so the test-language
    // generator (generateTestingLanguages) will also stamp X / LR / RL for
    // these strings, and so Transifex can discover them for real locales.
    // We use a stable @@-prefixed id so $localize can match by explicit id.
    const PRINT_VIEW_UNITS = [
      'printView.unnamedProfile',
      'printView.orcidIdAlt',
      'printView.biography',
      'printView.personalInformation',
      'printView.emails',
      'printView.websitesSocialLinks',
      'printView.otherIds',
      'printView.keywords',
      'printView.countries',
      'printView.activities',
      'printView.employments',
      'printView.educationAndQualifications',
      'printView.professionalActivities',
      'printView.fundings',
      'printView.researchResources',
      'printView.works',
      'printView.organization',
      'printView.organizationAddress',
      'printView.startDate',
      'printView.endDate',
      'printView.publicationDate',
      'printView.journal',
      'printView.roleTitle',
      'printView.department',
      'printView.type',
      'printView.url',
      'printView.untitled',
      'printView.identifier',
      'printView.enterOrcidId',
      'printView.orcidIdHelp',
      'printView.loadProfile',
      'printView.invalidOrcidId',
      'printView.loadingRecord',
      'printView.recordNotFound',
      'printView.redirectingToPrimary',
      'printView.fetchFailed',
      'printView.couldNotLoad',
      'printView.activityGroupHeading',
      'printView.peerReviewHeading',
      'printView.printSaveAsPdf',
      'printView.printThisOrcidProfile',
      'printView.relSelf',
      'printView.relPartOf',
      'printView.relVersionOf',
      'printView.relFundedBy',
    ]
    const PRINT_VIEW_SOURCES: Record<string, string> = {
      'printView.unnamedProfile': 'Unnamed ORCID profile',
      'printView.orcidIdAlt': 'ORCID iD',
      'printView.biography': 'Biography',
      'printView.personalInformation': 'Personal information',
      'printView.emails': 'Emails',
      'printView.websitesSocialLinks': 'Websites & social links',
      'printView.otherIds': 'Other IDs',
      'printView.keywords': 'Keywords',
      'printView.countries': 'Countries',
      'printView.activities': 'Activities',
      'printView.employments': 'Employments',
      'printView.educationAndQualifications': 'Education and qualifications',
      'printView.professionalActivities': 'Professional activities',
      'printView.fundings': 'Fundings',
      'printView.researchResources': 'Research Resources',
      'printView.works': 'Works',
      'printView.organization': 'Organization',
      'printView.organizationAddress': 'Organization address',
      'printView.startDate': 'Start date',
      'printView.endDate': 'End date',
      'printView.publicationDate': 'Publication date',
      'printView.journal': 'Journal',
      'printView.roleTitle': 'Role title',
      'printView.department': 'Department',
      'printView.type': 'Type',
      'printView.url': 'URL',
      'printView.untitled': 'Untitled',
      'printView.identifier': 'Identifier',
      'printView.enterOrcidId': 'Enter an ORCID iD',
      'printView.orcidIdHelp':
        'Add an ORCID iD to the URL or use the form below.',
      'printView.loadProfile': 'Load profile',
      'printView.invalidOrcidId':
        'Enter a valid ORCID iD (format: 0000-0000-0000-0000).',
      'printView.loadingRecord': 'Loading ORCID record...',
      'printView.recordNotFound':
        'Record data was not found in ORCID response.',
      'printView.redirectingToPrimary':
        'Redirecting to primary ORCID record\u2026',
      'printView.fetchFailed': 'Failed to fetch ORCID record',
      'printView.couldNotLoad': 'Could not load',
      'printView.activityGroupHeading': 'Activity group heading',
      'printView.peerReviewHeading': 'Peer review heading',
      'printView.printSaveAsPdf': 'Print / Save as PDF',
      'printView.printThisOrcidProfile': 'Print this ORCID profile',
      'printView.relSelf': 'Self',
      'printView.relPartOf': 'Part of',
      'printView.relVersionOf': 'Version of',
      'printView.relFundedBy': 'Funded by',
    }
    const existingIds = new Set(transUnits.map((tu: any) => tu?.$?.id))
    const printViewBody = fileNode?.body?.[0]
    PRINT_VIEW_UNITS.forEach((id) => {
      if (!existingIds.has(id)) {
        printViewBody['trans-unit'].push({
          $: { id, datatype: 'html', resname: id },
          source: [PRINT_VIEW_SOURCES[id] ?? id],
        })
      }
    })

    writeXlf(path, data)
    generateTestingLanguages(data)
  })
}

normalizeXlf12Sources('./src/locale/messages.xlf')
