import { sanitizeHtmlForTrustedBypass } from './sanitize-html-for-trusted-bypass'

describe('sanitizeHtmlForTrustedBypass', () => {
  it('strips script tags and their content', () => {
    const html = 'Hello <script>alert(1)</script> world'
    expect(sanitizeHtmlForTrustedBypass(html)).toBe('Hello  world')
  })

  it('strips script tags with attributes', () => {
    const html = 'Foo <script type="text/javascript">evil()</script> bar'
    expect(sanitizeHtmlForTrustedBypass(html)).toBe('Foo  bar')
  })

  it('strips style tags and their content', () => {
    const html = 'Text <style>.x { color: red }</style> more'
    expect(sanitizeHtmlForTrustedBypass(html)).toBe('Text  more')
  })

  it('leaves safe markup intact', () => {
    const html = '<span class="highlight">safe</span>'
    expect(sanitizeHtmlForTrustedBypass(html)).toBe(html)
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeHtmlForTrustedBypass(null as any)).toBe('')
    expect(sanitizeHtmlForTrustedBypass(undefined as any)).toBe('')
  })
})
