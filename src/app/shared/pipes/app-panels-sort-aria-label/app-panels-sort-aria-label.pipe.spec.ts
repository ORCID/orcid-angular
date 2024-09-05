import { AppPanelsSortAriaLabelPipe } from '../../pipes/app-panels-sort-aria-label/app-panels-sort-aria-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AppPanelsSortAriaLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new AppPanelsSortAriaLabelPipe()
    expect(pipe).toBeTruthy()
  })
})
