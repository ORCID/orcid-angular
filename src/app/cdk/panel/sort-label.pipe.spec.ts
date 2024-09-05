import { SortLabelPipe } from './sort-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SortLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new SortLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
