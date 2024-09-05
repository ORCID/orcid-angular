import { EditButtonAriaLabelPipe } from './edit-button-aria-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('EditButtonAriaLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new EditButtonAriaLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
