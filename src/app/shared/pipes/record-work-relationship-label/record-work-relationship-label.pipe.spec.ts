import { RecordWorkRelationshipLabelPipe } from './record-work-relationship-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordWorkRelationshipLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new RecordWorkRelationshipLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
