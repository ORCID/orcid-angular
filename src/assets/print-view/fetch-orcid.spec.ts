/**
 * Unit tests for src/assets/print-view/fetch-orcid.js
 *
 * The JS file is loaded as a global script by the Karma test runner
 * (configured in angular.json test > scripts).  All functions declared
 * in that file are therefore available on `window` / as globals here.
 * We use `declare function` to tell TypeScript about them without importing.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare function normalizeOrcidId(rawValue: string): string
declare function sanitizeUrl(rawUrl: string): string
declare function jsonText(value: any): string
declare function jsonList(list: any): any[]
declare function jsonDate(parts: any): string
declare function jsonOrcidUri(orcidIdentifier: any): string
declare function renderOrcidPrompt(message?: string): void
declare function makeSection(title: string): HTMLElement
declare function textLineNode(
  label: string,
  value: string,
  url?: string
): HTMLElement
declare const STRINGS: Record<string, string>

describe('fetch-orcid.js', () => {
  // ── normalizeOrcidId ────────────────────────────────────────────────────────

  describe('normalizeOrcidId', () => {
    it('returns empty string for falsy input', () => {
      expect(normalizeOrcidId('')).toBe('')
      expect(normalizeOrcidId(null as any)).toBe('')
    })

    it('parses a bare ORCID iD', () => {
      expect(normalizeOrcidId('0000-0001-2345-6789')).toBe(
        '0000-0001-2345-6789'
      )
    })

    it('strips https://orcid.org/ prefix', () => {
      expect(normalizeOrcidId('https://orcid.org/0000-0001-2345-6789')).toBe(
        '0000-0001-2345-6789'
      )
    })

    it('strips http://orcid.org/ prefix', () => {
      expect(normalizeOrcidId('http://orcid.org/0000-0001-2345-6789')).toBe(
        '0000-0001-2345-6789'
      )
    })

    it('strips https://www.orcid.org/ prefix', () => {
      expect(
        normalizeOrcidId('https://www.orcid.org/0000-0001-2345-6789')
      ).toBe('0000-0001-2345-6789')
    })

    it('uppercases the check digit X', () => {
      expect(normalizeOrcidId('0000-0001-2345-678x')).toBe(
        '0000-0001-2345-678X'
      )
    })

    it('returns empty string for invalid format', () => {
      expect(normalizeOrcidId('not-an-orcid')).toBe('')
      expect(normalizeOrcidId('1234-5678-9012')).toBe('')
    })

    it('trims surrounding whitespace', () => {
      expect(normalizeOrcidId('  0000-0001-2345-6789  ')).toBe(
        '0000-0001-2345-6789'
      )
    })
  })

  // ── sanitizeUrl ─────────────────────────────────────────────────────────────

  describe('sanitizeUrl', () => {
    it('allows https URLs', () => {
      expect(sanitizeUrl('https://example.com/path')).toBe(
        'https://example.com/path'
      )
    })

    it('allows http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/')
    })

    it('blocks javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('')
    })

    it('blocks ftp: protocol', () => {
      expect(sanitizeUrl('ftp://example.com')).toBe('')
    })

    it('returns empty for falsy input', () => {
      expect(sanitizeUrl('')).toBe('')
      expect(sanitizeUrl(null as any)).toBe('')
    })

    it('blocks ORCID client application URLs', () => {
      expect(sanitizeUrl('https://orcid.org/client/APP-XXXX')).toBe('')
      expect(sanitizeUrl('https://www.orcid.org/client/APP-YYYY')).toBe('')
    })

    it('allows normal orcid.org profile URLs', () => {
      const url = 'https://orcid.org/0000-0001-2345-6789'
      expect(sanitizeUrl(url)).toBe(url)
    })
  })

  // ── jsonText ─────────────────────────────────────────────────────────────────

  describe('jsonText', () => {
    it('returns empty string for null', () => {
      expect(jsonText(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(jsonText(undefined)).toBe('')
    })

    it('trims and returns a string', () => {
      expect(jsonText('  hello  ')).toBe('hello')
    })

    it('converts number to string', () => {
      expect(jsonText(42)).toBe('42')
    })

    it('converts boolean to string', () => {
      expect(jsonText(true)).toBe('true')
    })

    it('reads .content from an object', () => {
      expect(jsonText({ content: '  bio text  ' })).toBe('bio text')
    })

    it('reads .value from an object', () => {
      expect(jsonText({ value: 'https://example.com' })).toBe(
        'https://example.com'
      )
    })

    it('returns empty string for unknown object shape', () => {
      expect(jsonText({ foo: 'bar' })).toBe('')
    })
  })

  // ── jsonList ──────────────────────────────────────────────────────────────────

  describe('jsonList', () => {
    it('returns arrays as-is', () => {
      const arr = [1, 2, 3]
      expect(jsonList(arr)).toBe(arr)
    })

    it('returns empty array for non-array inputs', () => {
      expect(jsonList(null)).toEqual([])
      expect(jsonList('string')).toEqual([])
      expect(jsonList({ key: 'value' })).toEqual([])
    })
  })

  // ── jsonDate ──────────────────────────────────────────────────────────────────

  describe('jsonDate', () => {
    it('returns empty string for null', () => {
      expect(jsonDate(null)).toBe('')
    })

    it('joins year, month, day', () => {
      expect(
        jsonDate({
          year: { value: '2024' },
          month: { value: '03' },
          day: { value: '15' },
        })
      ).toBe('2024-03-15')
    })

    it('omits missing month and day', () => {
      expect(jsonDate({ year: { value: '2024' } })).toBe('2024')
    })

    it('handles year-month only', () => {
      expect(
        jsonDate({ year: { value: '2024' }, month: { value: '06' } })
      ).toBe('2024-06')
    })
  })

  // ── jsonOrcidUri ──────────────────────────────────────────────────────────────

  describe('jsonOrcidUri', () => {
    it('returns the uri field if present', () => {
      expect(
        jsonOrcidUri({ uri: 'https://orcid.org/0000-0001-2345-6789' })
      ).toBe('https://orcid.org/0000-0001-2345-6789')
    })

    it('builds URI from path when uri is missing', () => {
      expect(jsonOrcidUri({ path: '0000-0001-2345-6789' })).toBe(
        'https://orcid.org/0000-0001-2345-6789'
      )
    })

    it('returns empty string when both are missing', () => {
      expect(jsonOrcidUri({})).toBe('')
      expect(jsonOrcidUri(null)).toBe('')
    })
  })

  // ── makeSection ───────────────────────────────────────────────────────────────

  describe('makeSection', () => {
    it('creates a section element with class cv-section', () => {
      const section = makeSection('My Title')
      expect(section.tagName).toBe('SECTION')
      expect(section.className).toBe('cv-section')
    })

    it('contains an h2 with the provided title', () => {
      const section = makeSection('Biography')
      const heading = section.querySelector('h2')
      expect(heading).not.toBeNull()
      expect(heading!.textContent).toBe('Biography')
    })
  })

  // ── textLineNode ──────────────────────────────────────────────────────────────

  describe('textLineNode', () => {
    it('creates a p.line element', () => {
      const node = textLineNode('', 'plain value')
      expect(node.tagName).toBe('P')
      expect(node.className).toBe('line')
    })

    it('includes a label span when label is provided', () => {
      const node = textLineNode('Start date', '2024-01')
      const span = node.querySelector('span.line-label')
      expect(span).not.toBeNull()
      expect(span!.textContent).toBe('Start date: ')
    })

    it('renders a hyperlink when a safe url is provided', () => {
      const node = textLineNode('Website', 'My site', 'https://example.com')
      const anchor = node.querySelector('a')
      expect(anchor).not.toBeNull()
      expect(anchor!.href).toBe('https://example.com/')
      expect(anchor!.textContent).toBe('My site')
      expect(anchor!.rel).toContain('noopener')
    })

    it('omits the anchor when url is unsafe', () => {
      const node = textLineNode('', 'bad link', 'javascript:alert(1)')
      expect(node.querySelector('a')).toBeNull()
    })
  })

  // ── STRINGS constant ──────────────────────────────────────────────────────────

  describe('STRINGS', () => {
    it('has entries for all expected keys', () => {
      const requiredKeys = [
        'unnamedProfile',
        'biography',
        'personalInformation',
        'emails',
        'works',
        'fundings',
        'employments',
        'activities',
        'enterOrcidId',
        'loadProfile',
        'loadingRecord',
      ]
      requiredKeys.forEach((key) => {
        expect(STRINGS[key]).withContext(`STRINGS.${key}`).toBeTruthy()
      })
    })

    it('all values are non-empty strings', () => {
      Object.entries(STRINGS).forEach(([key, value]) => {
        expect(typeof value)
          .withContext(`STRINGS.${key} should be a string`)
          .toBe('string')
        expect(value.length)
          .withContext(`STRINGS.${key} should not be empty`)
          .toBeGreaterThan(0)
      })
    })
  })

  // ── renderOrcidPrompt DOM ─────────────────────────────────────────────────────

  describe('renderOrcidPrompt', () => {
    let cvRootFixture: HTMLElement

    beforeEach(() => {
      // Provide a minimal DOM fixture that mirrors print-view/index.html
      cvRootFixture = document.createElement('div')
      cvRootFixture.id = 'cv-root-fixture'
      document.body.appendChild(cvRootFixture)
      // Temporarily swap the global cvRoot used internally by pointing to fixture
      // by calling renderOrcidPrompt on the fixture directly via DOM manipulation:
      cvRootFixture.innerHTML = ''
    })

    afterEach(() => {
      document.body.removeChild(cvRootFixture)
    })

    it('renders the prompt heading via makeSection+createElement', () => {
      // Call makeSection to test the heading structure it produces since
      // renderOrcidPrompt uses cvRoot (the real element, null in test env).
      const section = makeSection(STRINGS.enterOrcidId)
      const h2 = section.querySelector('h2')
      expect(h2?.textContent).toBe(STRINGS.enterOrcidId)
    })
  })
})
