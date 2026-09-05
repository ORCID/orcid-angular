import { Paragraph, parseMarkdownLite } from './markdown-lite'

/**
 * The parser exists twice — once in the CMS build (`scripts/`) and once here —
 * and two hand-rolled implementations of the same grammar drift. The golden
 * fixture is the shared record of what the grammar means, so both sides can be
 * held to it instead of to each other.
 *
 * It is authored in the CMS repo at
 * `scripts/__tests__/fixtures/markdown-lite.golden.json`. Karma can only serve
 * files under `src/assets`, so a copy has to be placed here for this spec to
 * run:
 *
 *   cp ../orcid-homepage-decap-cms/scripts/__tests__/fixtures/\
 *      markdown-lite.golden.json src/assets/home-fixtures/
 *
 * Until that copy exists the spec reports itself skipped rather than passing
 * silently, because a green run with no fixture is worse than a missing one.
 */
const GOLDEN_URL = '/assets/home-fixtures/markdown-lite.golden.json'

interface GoldenCase {
  name?: string
  input?: string
  markdown?: string
  source?: string
  expected?: Paragraph[]
  paragraphs?: Paragraph[]
  nodes?: Paragraph[]
}

interface GoldenFile {
  cases?: GoldenCase[]
}

function inputOf(testCase: GoldenCase): string {
  return testCase.input ?? testCase.markdown ?? testCase.source ?? ''
}

function expectedOf(testCase: GoldenCase): Paragraph[] {
  return testCase.expected ?? testCase.paragraphs ?? testCase.nodes ?? []
}

describe('markdown-lite against the shared golden fixture', () => {
  let cases: GoldenCase[] | null = null
  let loadFailure = ''

  beforeAll(async () => {
    try {
      const response = await fetch(GOLDEN_URL)
      if (!response.ok) {
        loadFailure = `${GOLDEN_URL} returned ${response.status}`
        return
      }
      const body = (await response.json()) as GoldenFile | GoldenCase[]
      cases = Array.isArray(body) ? body : body.cases ?? null
      if (cases === null) {
        loadFailure = `${GOLDEN_URL} has no array of cases`
      }
    } catch (error) {
      loadFailure = `${GOLDEN_URL} could not be read: ${error}`
    }
  })

  it('parses every golden input to the recorded nodes', () => {
    if (cases === null) {
      pending(`golden fixture not available — ${loadFailure}`)
      return
    }

    expect(cases.length).toBeGreaterThan(0)
    for (const testCase of cases) {
      const label = testCase.name ?? JSON.stringify(inputOf(testCase))
      expect(parseMarkdownLite(inputOf(testCase)))
        .withContext(label)
        .toEqual(expectedOf(testCase))
    }
  })
})
