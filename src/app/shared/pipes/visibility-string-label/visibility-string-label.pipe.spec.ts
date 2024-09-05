import { VisibilityStringLabelPipe } from './visibility-string-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('VisibilityStringLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new VisibilityStringLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
