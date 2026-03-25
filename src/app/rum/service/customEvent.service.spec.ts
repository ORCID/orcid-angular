import { TestBed } from '@angular/core/testing'
import { RumJourneyEventService } from './customEvent.service'
import { WINDOW } from 'src/app/cdk/window'

declare const global: any

describe('RumJourneyEventService', () => {
  let service: RumJourneyEventService
  let addPageActionSpy: jasmine.Spy
  let mockWindow: any

  beforeEach(() => {
    // Ensure debugger flag is present
    global.runtimeEnvironment = { debugger: false }

    addPageActionSpy = jasmine.createSpy('addPageAction')
    mockWindow = { newrelic: { addPageAction: addPageActionSpy } }

    TestBed.configureTestingModule({
      providers: [
        RumJourneyEventService,
        { provide: WINDOW, useValue: mockWindow },
      ],
    })

    service = TestBed.inject(RumJourneyEventService)
  })

  it('records events with prefixed keys and system fields', () => {
    service.startJourney('oauth_authorization', {
      client_id: 'client-123',
      scope: 'read',
    })

    service.recordEvent('oauth_authorization', 'error_page_loaded', {
      error: 'invalid_request',
    })

    expect(addPageActionSpy).toHaveBeenCalled()
    const [eventType, payload] = addPageActionSpy.calls.mostRecent().args
    expect(eventType).toBe('oauth_authorization')

    // journey context prefixes
    expect(payload.journeyContext_client_id).toBe('client-123')
    expect(payload.journeyContext_scope).toBe('read')

    // event attr prefixes
    expect(payload.eventAttribute_error).toBe('invalid_request')

    // system fields
    expect(payload.system_eventName).toBe('error_page_loaded')
    expect(typeof payload.system_elapsedMs).toBe('number')
    expect(payload.system_journeyType).toBe('oauth_authorization')
    expect(typeof payload.system_journeyId).toBe('string')
  })

  it('finishJourney sends final event and clears state', () => {
    service.startJourney('orcid_registration', { isReactivation: true })
    addPageActionSpy.calls.reset()

    service.finishJourney('orcid_registration', { response: { ok: true } })

    expect(addPageActionSpy).toHaveBeenCalled()
    const [eventType, payload] = addPageActionSpy.calls.mostRecent().args
    expect(eventType).toBe('orcid_registration')
    expect(payload.system_eventName).toBe('journey_finished')
    expect(payload.journeyContext_isReactivation).toBe(true)
    expect(payload.eventAttribute_response).toEqual({ ok: true })

    // Further events after finish should be ignored (no throw, no NR call)
    addPageActionSpy.calls.reset()
    service.recordEvent('orcid_registration', 'after_finish_event')
    expect(addPageActionSpy).not.toHaveBeenCalled()
  })

  it('updateJourneyContext merges additional context for subsequent events', () => {
    service.startJourney('oauth_authorization', { client_id: 'c1' })
    service.updateJourneyContext('oauth_authorization', { scope: 'email' })

    service.recordEvent('oauth_authorization', 'flag_status', {
      OAUTH_AUTHORIZATION: true,
    })

    const [, payload] = addPageActionSpy.calls.mostRecent().args
    expect(payload.journeyContext_client_id).toBe('c1')
    expect(payload.journeyContext_scope).toBe('email')
    expect(payload.eventAttribute_OAUTH_AUTHORIZATION).toBe(true)
  })

  it('ignores second startJourney call for the same journey', () => {
    service.startJourney('oauth_authorization', { client_id: 'first' })
    // Second call should be ignored
    service.startJourney('oauth_authorization', { client_id: 'second' })

    service.recordEvent('oauth_authorization', 'check')
    const [, payload] = addPageActionSpy.calls.mostRecent().args
    expect(payload.journeyContext_client_id).toBe('first')
    expect(payload.journeyContext_client_id).not.toBe('second')
  })

  it('guards when New Relic is unavailable', () => {
    // Recreate service with no newrelic
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [RumJourneyEventService, { provide: WINDOW, useValue: {} }],
    })
    const localService = TestBed.inject(RumJourneyEventService)

    expect(() => {
      localService.startJourney('orcid_notifications', {
        inboxUnread: 0,
        notificationsEnabled: false,
      })
      localService.recordEvent('orcid_notifications', 'open_inbox')
      localService.finishJourney('orcid_notifications')
    }).not.toThrow()
  })
})
