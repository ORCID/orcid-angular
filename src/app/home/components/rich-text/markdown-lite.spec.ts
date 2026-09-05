import { parseMarkdownLite } from './markdown-lite'

describe('parseMarkdownLite', () => {
  it('returns nothing for empty input', () => {
    expect(parseMarkdownLite('')).toEqual([])
    expect(parseMarkdownLite('   ')).toEqual([])
    expect(parseMarkdownLite(undefined as any)).toEqual([])
  })

  it('reads plain text as a single paragraph', () => {
    expect(parseMarkdownLite('Hello there')).toEqual([
      [{ type: 'text', text: 'Hello there' }],
    ])
  })

  it('splits paragraphs on a blank line', () => {
    const paragraphs = parseMarkdownLite('First.\n\nSecond.')
    expect(paragraphs.length).toBe(2)
    expect(paragraphs[1]).toEqual([{ type: 'text', text: 'Second.' }])
  })

  it('treats a single newline as a space within a paragraph', () => {
    expect(parseMarkdownLite('One\ntwo')).toEqual([
      [{ type: 'text', text: 'One two' }],
    ])
  })

  it('handles Windows line endings', () => {
    expect(parseMarkdownLite('First.\r\n\r\nSecond.').length).toBe(2)
  })

  it('reads bold', () => {
    expect(parseMarkdownLite('ORCID is **free** today')).toEqual([
      [
        { type: 'text', text: 'ORCID is ' },
        { type: 'bold', text: 'free' },
        { type: 'text', text: ' today' },
      ],
    ])
  })

  it('reads an https link', () => {
    expect(parseMarkdownLite('See [our site](https://info.orcid.org).')).toEqual(
      [
        [
          { type: 'text', text: 'See ' },
          {
            type: 'link',
            text: 'our site',
            href: 'https://info.orcid.org',
          },
          { type: 'text', text: '.' },
        ],
      ]
    )
  })

  it('reads a mailto link', () => {
    const [paragraph] = parseMarkdownLite('[Email us](mailto:support@orcid.org)')
    expect(paragraph[0]).toEqual({
      type: 'link',
      text: 'Email us',
      href: 'mailto:support@orcid.org',
    })
  })

  it('reads several links in one paragraph', () => {
    const [paragraph] = parseMarkdownLite(
      '[A](https://orcid.org/a) and [B](https://orcid.org/b)'
    )
    expect(paragraph.filter((node) => node.type === 'link').length).toBe(2)
  })

  for (const unsafe of [
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'data:text/html;base64,PHN2Zz4=',
    'http://orcid.org',
    '/relative/path',
    'vbscript:msgbox(1)',
  ]) {
    it(`never produces a link for ${unsafe}`, () => {
      const [paragraph] = parseMarkdownLite(`Click [here](${unsafe}) now`)
      expect(paragraph.some((node) => node.type === 'link')).toBeFalse()
      // The text stays visible rather than vanishing from the page.
      expect(paragraph.map((node) => node.text).join('')).toContain('here')
    })
  }

  it('leaves raw HTML as text, never as markup', () => {
    const [paragraph] = parseMarkdownLite('Use <script>alert(1)</script> here')
    expect(paragraph.every((node) => node.type === 'text')).toBeTrue()
  })

  it('leaves an unmatched bold marker as literal text', () => {
    expect(parseMarkdownLite('Two ** stars')).toEqual([
      [{ type: 'text', text: 'Two ** stars' }],
    ])
  })

  it('leaves a malformed link as literal text', () => {
    const [paragraph] = parseMarkdownLite('Broken ](https://orcid.org) link')
    expect(paragraph.every((node) => node.type === 'text')).toBeTrue()
  })

  it('does not carry regex state between calls', () => {
    const source = '[A](https://orcid.org/a)'
    expect(parseMarkdownLite(source)).toEqual(parseMarkdownLite(source))
  })

  it('parses real homepage copy', () => {
    const [paragraph] = parseMarkdownLite(
      'Distinguish yourself and claim credit for your work no matter how many ' +
        'people have your same (or similar) name. [Sign up here.](https://orcid.org/register)'
    )
    expect(paragraph[paragraph.length - 1]).toEqual({
      type: 'link',
      text: 'Sign up here.',
      href: 'https://orcid.org/register',
    })
  })
})
