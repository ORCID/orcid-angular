import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'

import { OauthService } from './oauth.service'
import { WINDOW } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { AppEventName } from 'src/app/register/app-event-names'

describe('OauthService', () => {
  let service: OauthService
  let router: jasmine.SpyObj<Router>
  let observability: jasmine.SpyObj<RumJourneyEventService>
  let errorHandler: jasmine.SpyObj<ErrorHandlerService>
  let mockWindow: { outOfRouterNavigation: jasmine.Spy }

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    routerSpy.navigate.and.returnValue(Promise.resolve(true))
    const platformInfoSpy = jasmine.createSpyObj('PlatformInfoService', ['get'])
    const errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ])
    errorHandlerSpy.handleError.and.returnValue(of(null))
    const cookieSpy = jasmine.createSpyObj('CookieService', ['get'])
    const observabilitySpy = jasmine.createSpyObj('RumJourneyEventService', [
      'recordSimpleEvent',
    ])
    mockWindow = {
      outOfRouterNavigation: jasmine.createSpy('outOfRouterNavigation'),
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PlatformInfoService, useValue: platformInfoSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy },
        { provide: CookieService, useValue: cookieSpy },
        { provide: RumJourneyEventService, useValue: observabilitySpy },
        { provide: WINDOW, useValue: mockWindow },
      ],
    })
    service = TestBed.inject(OauthService)
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>
    observability = TestBed.inject(
      RumJourneyEventService
    ) as jasmine.SpyObj<RumJourneyEventService>
    errorHandler = TestBed.inject(
      ErrorHandlerService
    ) as jasmine.SpyObj<ErrorHandlerService>
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('records legacy client-handled oauth session redirect event', () => {
    const session: any = {
      error: 'login_required',
      errorCode: '401',
      errorDescription: 'Login required',
      redirectUrl: 'https://example.org/callback',
    }
    const query: any = {
      client_id: 'client-id',
      redirect_uri: 'https://example.org/callback',
    }

    service.handleSessionErrors(session, query).subscribe({
      next: () => fail('Expected NEVER observable'),
      complete: () => fail('Expected NEVER observable'),
    })

    expect(observability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.OauthSessionClientHandledErrorRedirectLegacy,
      jasmine.objectContaining({
        oauth_error: 'login_required',
        oauth_error_code: '401',
        client_id: 'client-id',
        redirect_uri: 'https://example.org/callback',
      })
    )
    expect(mockWindow.outOfRouterNavigation).toHaveBeenCalledWith(
      'https://example.org/callback#error=login_required'
    )
  })

  it('records legacy oauth session navigate-authorize error event', fakeAsync(() => {
    const session: any = {
      error: 'server_error',
      errorDescription: 'Unexpected backend error',
      errors: ['oauth_issue'],
    }
    const query: any = {
      client_id: 'client-id',
      redirect_uri: 'https://example.org/callback',
    }

    let emitted: any = undefined
    service.handleSessionErrors(session, query).subscribe((value) => {
      emitted = value
    })

    expect(observability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.OauthSessionNavigateAuthorizeErrorLegacy,
      jasmine.objectContaining({
        oauth_error: 'server_error',
        oauth_errors: 'oauth_issue',
        client_id: 'client-id',
        redirect_uri: 'https://example.org/callback',
      })
    )
    expect(router.navigate).toHaveBeenCalled()
    tick()
    expect(errorHandler.handleError).toHaveBeenCalled()
    expect(emitted).toBe(session)
  }))
})
