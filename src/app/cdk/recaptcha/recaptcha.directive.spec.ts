import { RecaptchaDirective } from './recaptcha.directive'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of } from 'rxjs'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { ConfigMessageKey } from 'src/app/types/config.endpoint'
import { WINDOW } from '../window'

describe('RecaptchaDirective', () => {
  it('should create an instance', () => {
    const togglzServiceMock = {
      getConfigurationOf: (_key: ConfigMessageKey) => of('key'),
    } as unknown as TogglzService
    const errorHandlerMock = {
      handleError: () => of(null),
    } as unknown as ErrorHandlerService
    const directive = new RecaptchaDirective(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      errorHandlerMock,
      togglzServiceMock
    )
    expect(directive).toBeTruthy()
  })
})
