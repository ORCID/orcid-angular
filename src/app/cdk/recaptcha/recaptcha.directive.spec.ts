import { RecaptchaDirective } from './recaptcha.directive'

import { of } from 'rxjs'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'

describe('RecaptchaDirective', () => {
  it('renders with the registration session key', () => {
    const errorHandlerMock = {
      handleError: () => of(null),
    } as unknown as ErrorHandlerService
    const render = jasmine.createSpy('render').and.returnValue(0)
    const windowMock: any = { grecaptcha: { render } }
    const directive = new RecaptchaDirective(
      windowMock,
      {} as any,
      { run: (fn: any) => fn() } as any,
      { nativeElement: {} } as any,
      errorHandlerMock
    )
    directive.siteKey = 'session-key'
    directive.registerReCaptchaCallback()
    windowMock.orcidReCaptchaOnLoad()
    expect(render.calls.mostRecent().args[1].sitekey).toBe('session-key')
  })
})
