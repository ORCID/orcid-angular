import { DomSanitizer } from '@angular/platform-browser'
import { SearchTermHighlightPipe } from './search-term-highlight.pipe'
import { SecurityContext } from '@angular/core'

describe('HighlightPipe', () => {
  let sanitizer: DomSanitizer
  let pipe: SearchTermHighlightPipe

  beforeEach(() => {
    sanitizer = {
      sanitize: (ctx: SecurityContext, value: any) => value,
      bypassSecurityTrustHtml: (value: string) => value,
    } as any

    pipe = new SearchTermHighlightPipe(sanitizer)
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should highlight a search term in the middle of a string', () => {
    const value = 'This is a sample text'
    const searchTerm = 'sample'
    const expected = 'This is a <span class="highlight">sample</span> text'
    expect(pipe.transform(value, searchTerm)).toEqual(expected)
  })

  it('should highlight a search term case-insensitively', () => {
    const value = 'Hello World, hello everyone'
    const searchTerm = 'hello'
    const expected =
      '<span class="highlight">Hello</span> World, <span class="highlight">hello</span> everyone'
    expect(pipe.transform(value, searchTerm)).toEqual(expected)
  })

  it('should highlight all occurrences of the search term', () => {
    const value = 'angular is awesome, I love angular'
    const searchTerm = 'angular'
    const expected =
      '<span class="highlight">angular</span> is awesome, I love <span class="highlight">angular</span>'
    expect(pipe.transform(value, searchTerm)).toEqual(expected)
  })

  it('should return the original value if search term is empty', () => {
    const value = 'Some text here'
    expect(pipe.transform(value, '')).toBe(value)
  })

  it('should return the original value if search term is null', () => {
    const value = 'Some text here'
    expect(pipe.transform(value, null)).toBe(value)
  })

  it('should return the original value if the value itself is null or undefined', () => {
    expect(pipe.transform(null, 'test')).toBe(null)
    expect(pipe.transform(undefined, 'test')).toBe(undefined)
  })

  it('should return the original value if no match is found', () => {
    const value = 'This is some text'
    const searchTerm = 'javascript'
    expect(pipe.transform(value, searchTerm)).toBe(value)
  })

  it('should handle special regex characters in the search term by escaping them', () => {
    const value = 'example with a.dot'
    const searchTerm = 'a.dot'

    const expected = 'example with <span class="highlight">a.dot</span>'
    const escapeRegex = (str: string) =>
      str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

    const improvedTransform = (val: string, term: string) => {
      if (!val || !term) return val
      const regex = new RegExp(escapeRegex(term), 'gi')
      const replaced = val.replace(
        regex,
        (match) => `<span class="highlight">${match}</span>`
      )
      return sanitizer.bypassSecurityTrustHtml(replaced)
    }

    expect(improvedTransform(value, searchTerm)).toEqual(expected)
  })
})
