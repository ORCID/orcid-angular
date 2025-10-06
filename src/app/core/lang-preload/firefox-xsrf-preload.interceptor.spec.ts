import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing'
import { CookieService } from 'ngx-cookie-service'
import { FirefoxXsrfPreloadInterceptor } from './firefox-xsrf-preload.interceptor'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { WINDOW } from 'src/app/cdk/window'
import { Platform } from '@angular/cdk/platform'

describe('FirefoxXsrfPreloadInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  let cookieGetSpy: jasmine.Spy
  let recordSimpleEventSpy: jasmine.Spy
  let reloadSpy: jasmine.Spy
  let platformMock: Partial<Platform>

  const apiBase = 'http://api/'

  beforeEach(() => {
    ;(window as any).runtimeEnvironment = {
      API_WEB: apiBase,
      BASE_URL: apiBase,
    }

    cookieGetSpy = jasmine.createSpy('get').and.returnValue('')
    recordSimpleEventSpy = jasmine.createSpy('recordSimpleEvent')
    reloadSpy = jasmine.createSpy('reload')

    platformMock = { FIREFOX: true } as any

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: FirefoxXsrfPreloadInterceptor,
          multi: true,
        },
        { provide: CookieService, useValue: { get: cookieGetSpy } },
        {
          provide: RumJourneyEventService,
          useValue: { recordSimpleEvent: recordSimpleEventSpy },
        },
        { provide: WINDOW, useValue: { location: { reload: reloadSpy } } },
        { provide: Platform, useValue: platformMock },
      ],
    })

    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('bypasses entirely on non-Firefox', () => {
    ;(TestBed.inject(Platform) as any).FIREFOX = false
    const fetchSpy = spyOn(window as any, 'fetch')
    http.get(apiBase + 'foo.json').subscribe()
    const req = httpMock.expectOne(apiBase + 'foo.json')
    req.flush({ ok: true })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('does not preload if XSRF cookie already exists on Firefox', () => {
    ;(TestBed.inject(Platform) as any).FIREFOX = true
    cookieGetSpy.and.returnValue('token')
    const fetchSpy = spyOn(window as any, 'fetch')
    http.get(apiBase + 'foo.json').subscribe()
    const req = httpMock.expectOne(apiBase + 'foo.json')
    req.flush({ ok: true })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('preloads cors.json and gates request when cookie missing on Firefox', fakeAsync(() => {
    ;(TestBed.inject(Platform) as any).FIREFOX = true
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve(new Response())
    )

    http.get(apiBase + 'foo.json').subscribe()
    httpMock.expectNone(apiBase + 'foo.json')

    flushMicrotasks()

    expect(fetchSpy).toHaveBeenCalledWith(apiBase + 'cors.json', {
      credentials: 'include',
    })

    const req = httpMock.expectOne(apiBase + 'foo.json')
    req.flush({ ok: true })
  }))

  it('reports and reloads if cookie still missing after preload', fakeAsync(() => {
    ;(TestBed.inject(Platform) as any).FIREFOX = true
    // Missing before and after
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve(new Response())
    )

    http.get(apiBase + 'foo.json').subscribe()
    flushMicrotasks()

    expect(fetchSpy).toHaveBeenCalled()
    expect(recordSimpleEventSpy).toHaveBeenCalledWith(
      'xsrf_missing_after_preload',
      jasmine.objectContaining({
        error: 'xsrf_missing',
      })
    )
    expect(reloadSpy).toHaveBeenCalled()

    const req = httpMock.expectOne(apiBase + 'foo.json')
    req.flush({ ok: true })
  }))
})
