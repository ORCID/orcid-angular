import { TestBed } from '@angular/core/testing'
import { RumJourneyEventService } from './customEvent.service'
import { WINDOW } from 'src/app/cdk/window'
import { NewRelicService } from 'src/app/core/new-relic/new-relic.service'
import { AppEventName } from 'src/app/rum/app-event-names'

declare const global: any

describe('RumJourneyEventService', () => {
  let service: RumJourneyEventService
  let addPageActionSpy: jasmine.Spy
  let forceHarvestNowSpy: jasmine.Spy
  let mockWindow: any

  beforeEach(() => {
    // Ensure debugger flag is present
    global.runtimeEnvironment = { debugger: false }

    addPageActionSpy = jasmine.createSpy('addPageAction')
    forceHarvestNowSpy = jasmine.createSpy('forceHarvestNow')
    mockWindow = { newrelic: { addPageAction: addPageActionSpy } }

    TestBed.configureTestingModule({
      providers: [
        RumJourneyEventService,
        { provide: WINDOW, useValue: mockWindow },
        {
          provide: NewRelicService,
          useValue: { forceHarvestNow: forceHarvestNowSpy },
        },
      ],
    })

    service = TestBed.inject(RumJourneyEventService)
  })

  it('records events with prefixed keys and system fields', () => {
    service.startJourney('oauth_authorization', {
      scope: 'read',
      response_type: 'code',
    })

    service.recordEvent('oauth_authorization', 'error_page_loaded', {
      error: 'invalid_request',
    })

    expect(addPageActionSpy).toHaveBeenCalled()
    const [eventType, payload] = addPageActionSpy.calls.mostRecent().args
    expect(eventType).toBe('oauth_authorization')

    // journey context prefixes
    expect(payload.journeyContext_scope).toBe('read')
    expect(payload.journeyContext_response_type).toBe('code')

    // event attr prefixes
    expect(payload.eventAttribute_error).toBe('invalid_request')

    // system fields
    expect(payload.system_eventName).toBe('error_page_loaded')
    expect(typeof payload.system_elapsedMs).toBe('number')
    expect(payload.system_journeyType).toBe('oauth_authorization')
    expect(typeof payload.system_journeyId).toBe('string')
    expect(forceHarvestNowSpy).toHaveBeenCalledTimes(1)
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
    expect(forceHarvestNowSpy).toHaveBeenCalledTimes(1)

    // Further events after finish should be ignored (no throw, no NR call)
    addPageActionSpy.calls.reset()
    forceHarvestNowSpy.calls.reset()
    service.recordEvent('orcid_registration', 'after_finish_event')
    expect(addPageActionSpy).not.toHaveBeenCalled()
    expect(forceHarvestNowSpy).not.toHaveBeenCalled()
  })

  it('updateJourneyContext merges additional context for subsequent events', () => {
    service.startJourney('oauth_authorization', { response_type: 'code' })
    service.updateJourneyContext('oauth_authorization', { scope: 'email' })

    service.recordEvent('oauth_authorization', 'flag_status', {
      OAUTH_AUTHORIZATION: true,
    })

    const [, payload] = addPageActionSpy.calls.mostRecent().args
    expect(payload.journeyContext_response_type).toBe('code')
    expect(payload.journeyContext_scope).toBe('email')
    expect(payload.eventAttribute_OAUTH_AUTHORIZATION).toBe(true)
    expect(forceHarvestNowSpy).not.toHaveBeenCalled()
  })

  it('ignores second startJourney call for the same journey', () => {
    service.startJourney('oauth_authorization', { response_type: 'first' })
    // Second call should be ignored
    service.startJourney('oauth_authorization', { response_type: 'second' })

    service.recordEvent('oauth_authorization', 'check')
    const [, payload] = addPageActionSpy.calls.mostRecent().args
    expect(payload.journeyContext_response_type).toBe('first')
    expect(payload.journeyContext_response_type).not.toBe('second')
    expect(forceHarvestNowSpy).not.toHaveBeenCalled()
  })

  it('obfuscates sensitive identifiers into hint strings for simple-event payloads', () => {
    service.recordSimpleEvent('privacy_check', {
      client_id: 'cid-1',
      redirect_uri: 'https://example.org/callback',
      oauth_query_string:
        'client_id=cid-1&redirect_uri=https://example.org/callback',
      email: 'user@example.org',
      safe_attr: 'ok',
    })

    const [, payload] = addPageActionSpy.calls.mostRecent().args
    expect(payload.client_id).toBe('cid-1')
    expect(payload.redirect_uri).toBe('https://example.org/callback')
    expect(payload.oauth_query_string).toContain('client_id=cid-1')
    expect(payload.email).toBe('[PID_HINT:email;len=16]')
    expect(payload.safe_attr).toBe('ok')
    expect(forceHarvestNowSpy).not.toHaveBeenCalled()
  })

  it('recordSimpleEvent triggers harvest for terminating events', () => {
    service.recordSimpleEvent(AppEventName.OauthAuthorizationValidationFailed, {
      surface: 'oauth_error_page',
    })
    expect(addPageActionSpy).toHaveBeenCalled()
    expect(forceHarvestNowSpy).toHaveBeenCalledTimes(1)
  })

  it('recordEvent triggers harvest for oauth authorization_success', () => {
    service.startJourney('oauth_authorization', { response_type: 'code' })
    addPageActionSpy.calls.reset()
    forceHarvestNowSpy.calls.reset()

    service.recordEvent(
      'oauth_authorization',
      AppEventName.OauthAuthorizationSuccess,
      {
        OAUTH_AUTHORIZATION: true,
      }
    )

    expect(addPageActionSpy).toHaveBeenCalledTimes(1)
    expect(forceHarvestNowSpy).toHaveBeenCalledTimes(1)
  })

  it('obfuscates sensitive nested values into hint strings for journey payloads', () => {
    service.startJourney('orcid_registration', {
      isReactivation: true,
      email: 'test@example.org',
    } as any)

    service.recordEvent('orcid_registration', 'step_a_next_button_clicked', {
      formValues: {
        orcid: '0000-0002-1825-0097',
        email: 'test@example.org',
        country: 'US',
      },
    } as any)

    const [, payload] = addPageActionSpy.calls.mostRecent().args
    expect(payload.journeyContext_email).toBe('[PID_HINT:email;len=16]')
    expect(payload.eventAttribute_formValues).toEqual({
      orcid: '[PID_HINT:orcid;len=19]',
      email: '[PID_HINT:email;len=16]',
      country: 'US',
    })
    expect(forceHarvestNowSpy).not.toHaveBeenCalled()
  })

  it('guards when New Relic is unavailable', () => {
    const localForceHarvest = jasmine.createSpy('forceHarvestNow')
    // Recreate service with no newrelic
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [
        RumJourneyEventService,
        { provide: WINDOW, useValue: {} },
        {
          provide: NewRelicService,
          useValue: { forceHarvestNow: localForceHarvest },
        },
      ],
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
    expect(localForceHarvest).not.toHaveBeenCalled()
  })

  it('guards when New Relic addPageAction throws', () => {
    const throwingWindow = {
      newrelic: {
        addPageAction: () => {
          throw new Error('nr exploded')
        },
      },
    }
    const localForceHarvest = jasmine.createSpy('forceHarvestNow')
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [
        RumJourneyEventService,
        { provide: WINDOW, useValue: throwingWindow },
        {
          provide: NewRelicService,
          useValue: { forceHarvestNow: localForceHarvest },
        },
      ],
    })
    const localService = TestBed.inject(RumJourneyEventService)

    expect(() => {
      localService.recordSimpleEvent('simple_event', { foo: 'bar' })
      localService.startJourney('oauth_authorization', {
        response_type: 'code',
      })
      localService.recordEvent('oauth_authorization', 'event')
      localService.finishJourney('oauth_authorization')
    }).not.toThrow()
    expect(localForceHarvest).not.toHaveBeenCalled()
  })
})
