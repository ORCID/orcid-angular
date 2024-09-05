import { A11yLinkDirective } from './a11y-link.directive'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('A11yLinkDirective', () => {
  it('should create an instance', () => {
    const directive = new A11yLinkDirective()
    expect(directive).toBeTruthy()
  })
})
