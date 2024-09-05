import { RecordFundingRelationshipLabelPipe } from './record-funding-relationship-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordFundingRelationshipLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new RecordFundingRelationshipLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
