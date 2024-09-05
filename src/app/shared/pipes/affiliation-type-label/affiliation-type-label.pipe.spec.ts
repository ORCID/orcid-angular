import { AffiliationTypeLabelPipe } from './affiliation-type-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AffiliationTypeLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new AffiliationTypeLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
