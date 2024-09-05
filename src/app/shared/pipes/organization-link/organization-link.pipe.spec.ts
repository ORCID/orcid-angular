import { OrganizationLinkPipe } from './organization-link.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('OrganizationLinkPipe', () => {
  let pipe: OrganizationLinkPipe

  beforeEach(() => {
    pipe = new OrganizationLinkPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return the same value if its already an url', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return the identifier prepend with an url or the same identifier', () => {
    expect(pipe.transform('GRID', 'grid.36212.34')).toBe('grid.36212.34')
    expect(pipe.transform('ISNI', '000000008969095X')).toBe(
      'https://isni.org/isni/000000008969095X'
    )
    expect(pipe.transform('LINKEDIN', 'orcid')).toBe(
      'https://www.linkedin.com/company/orcid'
    )
    expect(pipe.transform('WIKIDATA', 'Q23308')).toBe(
      'https://wikidata.org/wiki/Q23308'
    )
    expect(pipe.transform('ROR', 'https://ror.org/05dhe8b71')).toBe(
      'https://ror.org/05dhe8b71'
    )
  })
})
