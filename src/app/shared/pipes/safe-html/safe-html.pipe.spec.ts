import { SafeHtmlPipe } from './safe-html.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SafeHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeHtmlPipe(null)
    expect(pipe).toBeTruthy()
  })
})
