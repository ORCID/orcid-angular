import { RecordWorkTitleNameLabelPipe } from './record-work-title-name-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordWorkTitleNameLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new RecordWorkTitleNameLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
