import { AffiliationTypePipe } from './affiliation-type.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AffiliationTypePipe', () => {
  it('create an instance', () => {
    const pipe = new AffiliationTypePipe()
    expect(pipe).toBeTruthy()
  })
})
