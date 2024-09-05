import { RecaptchaDirective } from './recaptcha.directive'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecaptchaDirective', () => {
  it('should create an instance', () => {
    const directive = new RecaptchaDirective(null, null, null, null, null)
    expect(directive).toBeTruthy()
  })
})
