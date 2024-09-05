import { FormatBibtex } from './format-bibtex.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormatBibtexPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatBibtex()
    expect(pipe).toBeTruthy()
  })
})
