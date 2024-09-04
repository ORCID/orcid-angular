import { RecordFundingTypeLabelPipe } from './record-funding-type-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordFundingTypeLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new RecordFundingTypeLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
