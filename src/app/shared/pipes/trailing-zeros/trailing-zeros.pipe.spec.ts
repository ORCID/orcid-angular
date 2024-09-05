import { TrailingZerosPipe } from './trailing-zeros.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TrailingZerosPipe', () => {
  it('create an instance', () => {
    const pipe = new TrailingZerosPipe()
    expect(pipe).toBeTruthy()
  })
})
