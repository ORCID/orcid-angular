import { AffiliationLabelPipe } from './affiliation-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AffiliationLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new AffiliationLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
