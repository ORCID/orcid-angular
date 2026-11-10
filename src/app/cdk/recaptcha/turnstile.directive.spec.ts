import { ElementRef, NgZone } from '@angular/core'
import { TurnstileDirective } from './turnstile.directive'

describe('TurnstileDirective', () => {
  let directive: TurnstileDirective
  let options: any
  let api: any
  let change: jasmine.Spy

  beforeEach(() => {
    api = {
      render: jasmine.createSpy('render').and.callFake((_element, config) => {
        options = config
        return 'widget-id'
      }),
      reset: jasmine.createSpy('reset'),
      remove: jasmine.createSpy('remove'),
    }
    directive = new TurnstileDirective(
      { turnstile: api } as any,
      new ElementRef({}),
      { run: (fn: any) => fn() } as NgZone
    )
    directive.siteKey = 'session-key'
    change = jasmine.createSpy('change')
    directive.registerOnChange(change)
    directive.registerOnTouched(() => {})
  })

  it('renders the session key and forwards a token and loaded marker', () => {
    const loaded = jasmine.createSpy('loaded')
    directive.captchaLoaded.subscribe(loaded)
    directive.ngOnInit()
    expect(options.sitekey).toBe('session-key')
    expect(loaded).toHaveBeenCalledWith(0)
    options.callback('token')
    expect(change).toHaveBeenCalledWith('token')
  })

  it('clears expired and failed tokens and permits reset', () => {
    directive.ngOnInit()
    const failed = jasmine.createSpy('failed')
    directive.captchaFail.subscribe(failed)
    options['expired-callback']()
    expect(change).toHaveBeenCalledWith(null)
    expect(api.reset).toHaveBeenCalledWith('widget-id')
    options['error-callback']()
    expect(failed).toHaveBeenCalledWith(true)
    directive.reset()
    expect(api.reset).toHaveBeenCalledTimes(2)
    directive.ngOnDestroy()
    expect(api.remove).toHaveBeenCalledWith('widget-id')
  })

  it('does not report a loaded widget when the key is missing', () => {
    directive.siteKey = ''
    const loaded = jasmine.createSpy('loaded')
    directive.captchaLoaded.subscribe(loaded)
    directive.ngOnInit()
    expect(api.render).not.toHaveBeenCalled()
    expect(loaded).not.toHaveBeenCalled()
  })
})