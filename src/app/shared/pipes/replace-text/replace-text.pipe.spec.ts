import { ReplaceTextPipe } from './replace-text.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ReplaceTextPipe', () => {
  it('create an instance', () => {
    const pipe = new ReplaceTextPipe()
    expect(pipe).toBeTruthy()
  })
})
