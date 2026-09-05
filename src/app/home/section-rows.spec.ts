import { HomepageSection } from 'src/app/types/homepage-content.v2'
import { packSectionRows } from './section-rows'

function section(id: string, span: 'full' | 'half'): HomepageSection {
  return {
    id,
    type: 'prose',
    variant: 'default',
    layout: { span, spacing: 'normal', tone: 'default' },
    body: 'text',
  } as HomepageSection
}

function plan(spans: Array<'full' | 'half'>): string[][] {
  return packSectionRows(spans.map((span, i) => section(`s${i}`, span))).map(
    (row) => row.map((s) => s.id)
  )
}

describe('packSectionRows', () => {
  it('gives each full-width section its own row', () => {
    expect(plan(['full', 'full'])).toEqual([['s0'], ['s1']])
  })

  it('pairs two adjacent half-width sections', () => {
    expect(plan(['half', 'half'])).toEqual([['s0', 's1']])
  })

  it('leaves a third consecutive half on its own row', () => {
    expect(plan(['half', 'half', 'half'])).toEqual([['s0', 's1'], ['s2']])
  })

  it('pairs the third and fourth of four halves', () => {
    expect(plan(['half', 'half', 'half', 'half'])).toEqual([
      ['s0', 's1'],
      ['s2', 's3'],
    ])
  })

  it('breaks a pair when a full-width section sits between two halves', () => {
    expect(plan(['half', 'full', 'half'])).toEqual([['s0'], ['s1'], ['s2']])
  })

  it('leaves a trailing half on its own row', () => {
    expect(plan(['full', 'half'])).toEqual([['s0'], ['s1']])
  })

  it('preserves document order, so focus order always matches reading order', () => {
    const spans: Array<'full' | 'half'> = ['half', 'half', 'full', 'half']
    // This project's TypeScript lib predates Array.prototype.flat.
    const flat = plan(spans).reduce<string[]>((all, row) => all.concat(row), [])
    expect(flat).toEqual(['s0', 's1', 's2', 's3'])
  })

  it('returns nothing for an empty document', () => {
    expect(packSectionRows([])).toEqual([])
  })

  it('treats a section with no layout as full width rather than crashing', () => {
    const broken = [{ id: 'a', type: 'prose' } as unknown as HomepageSection]
    expect(packSectionRows(broken)).toEqual([broken])
  })
})
