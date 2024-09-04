import { RecordWorkTypeLabelPipe } from './record-work-type-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordWorkTypeLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new RecordWorkTypeLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
