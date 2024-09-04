import { RecordWorkCategoryLabelPipe } from './record-work-category-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordWorkCategoryLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new RecordWorkCategoryLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
