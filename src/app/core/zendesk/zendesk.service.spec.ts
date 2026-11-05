import { TestBed } from '@angular/core/testing'
import { WINDOW } from '../../cdk/window'
import { PlatformInfo } from '../../cdk/platform-info'

import { ZendeskService } from './zendesk.service'

describe('ZendeskService', () => {
  let service: ZendeskService
  let fakeWindow: any

  beforeEach(() => {
    fakeWindow = {
      location: { href: 'https://orcid.org/my-orcid' },
    }
    TestBed.configureTestingModule({
      providers: [{ provide: WINDOW, useValue: fakeWindow }],
    })
    service = TestBed.inject(ZendeskService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  /**
   * The snippet is a third party script and can be missing entirely. A throw
   * here would propagate into AppComponent's platformInfo subscription and
   * tear it down for the rest of the session.
   */
  it('does not throw when the widget is absent', () => {
    expect(() => service.hide()).not.toThrow()
    expect(() => service.show()).not.toThrow()
    expect(() => service.open()).not.toThrow()
    expect(() =>
      service.adaptPluginToPlatform({ screenDirection: 'rtl' } as PlatformInfo)
    ).not.toThrow()
    expect(() => service.autofillTicketForm()).not.toThrow()
  })

  it('forwards commands once the widget is present', () => {
    fakeWindow.zE = jasmine.createSpy('zE')

    service.hide()
    expect(fakeWindow.zE).toHaveBeenCalledWith('webWidget', 'hide')

    service.show()
    expect(fakeWindow.zE).toHaveBeenCalledWith('webWidget', 'show')

    service.open()
    expect(fakeWindow.zE).toHaveBeenCalledWith('webWidget', 'open')
  })

  it('moves the widget to the left on RTL locales', () => {
    fakeWindow.zE = jasmine.createSpy('zE')

    service.adaptPluginToPlatform({ screenDirection: 'ltr' } as PlatformInfo)
    expect(fakeWindow.zE).not.toHaveBeenCalled()

    service.adaptPluginToPlatform({ screenDirection: 'rtl' } as PlatformInfo)
    expect(fakeWindow.zE).toHaveBeenCalledWith('webWidget', 'updateSettings', {
      webWidget: {
        position: { horizontal: 'left', vertical: 'bottom' },
      },
    })
  })

  it('prefills the ticket form without a prior hide or show call', () => {
    fakeWindow.zE = jasmine.createSpy('zE')

    service.autofillTicketForm(undefined, 'App Oauth URL with issues')

    expect(fakeWindow.zE).toHaveBeenCalled()
    const settings = fakeWindow.zE.calls.mostRecent().args[2]
    const subject = settings.webWidget.contactForm.fields.find(
      (field) => field.id === 'subject'
    )
    expect(subject.prefill['*']).toBe('App Oauth URL with issues')
  })
})
