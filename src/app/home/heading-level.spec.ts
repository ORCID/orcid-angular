import {
  clampLevel,
  HeadingLevel,
  headingId,
  nextLevel,
  SECTION_HEADING_LEVEL,
} from './heading-level'

describe('the heading level rule', () => {
  it('starts sections at level 2, directly under the page h1', () => {
    expect(SECTION_HEADING_LEVEL).toBe(2)
  })

  it('puts an item under a titled section one level deeper', () => {
    expect(nextLevel(SECTION_HEADING_LEVEL, true)).toBe(3)
  })

  it('leaves an item under an untitled section at the section level', () => {
    expect(nextLevel(SECTION_HEADING_LEVEL, false)).toBe(2)
  })

  it('opens no gap in the outline when an ancestor has no title', () => {
    // The worked example from the spec: an untitled audience selector whose
    // audience labels are h2 and whose features are h3. Were the increment
    // unconditional the features would be h4 under an h2, a skipped level.
    const sectionLevel = SECTION_HEADING_LEVEL
    const audienceLevel = nextLevel(sectionLevel, false)
    const featureLevel = nextLevel(audienceLevel, true)

    expect(audienceLevel).toBe(2)
    expect(featureLevel).toBe(3)
  })

  it('never skips a level however deeply content nests', () => {
    let level = SECTION_HEADING_LEVEL
    const outline: HeadingLevel[] = [level]

    for (let depth = 0; depth < 10; depth++) {
      const child = nextLevel(level, true)
      expect(child - level).toBeLessThanOrEqual(1)
      outline.push(child)
      level = child
    }

    expect(outline[outline.length - 1]).toBe(6)
  })

  it('stops at 6 rather than asking for a heading HTML does not have', () => {
    expect(nextLevel(6, true)).toBe(6)
    expect(clampLevel(7)).toBe(6)
    expect(clampLevel(99)).toBe(6)
  })

  it('never produces a level above the page h1', () => {
    expect(clampLevel(0)).toBe(1)
    expect(clampLevel(-5)).toBe(1)
  })
})

describe('heading ids', () => {
  it('gives a section title the same id every time', () => {
    expect(headingId('latest-news')).toBe(headingId('latest-news'))
    expect(headingId('latest-news')).toBe('section-latest-news-title')
  })

  it('gives an item its own id under its section', () => {
    expect(headingId('for-researchers', 'uniquely-yours')).toBe(
      'section-for-researchers-uniquely-yours-title'
    )
  })

  it('gives different content different ids', () => {
    const ids = [
      headingId('latest-news'),
      headingId('get-started'),
      headingId('latest-news', 'first'),
      headingId('latest-news', 'second'),
      headingId('get-started', 'first'),
    ]

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('does not depend on the heading text, so it survives translation', () => {
    // The same section rendered into two locales: the id is built from the
    // content id, so `aria-labelledby` still resolves after translation.
    expect(headingId('latest-news')).toBe(headingId('latest-news'))
  })

  it('produces an id that is a single token, whatever the content id holds', () => {
    // `id` and `aria-labelledby` are space-separated token lists: a space here
    // would break the reference silently rather than loudly.
    const id = headingId('bad id', 'worse id')

    expect(id).not.toContain(' ')
    expect(headingId('bad id')).not.toBe(headingId('badid'))
  })
})
