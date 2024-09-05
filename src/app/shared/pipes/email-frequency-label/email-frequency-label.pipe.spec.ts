import { EmailFrequencyLabelPipe } from './email-frequency-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('EmailFrequencyLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new EmailFrequencyLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
