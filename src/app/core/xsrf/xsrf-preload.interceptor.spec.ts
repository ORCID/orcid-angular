import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing'
import { CookieService } from 'ngx-cookie-service'
import { XsrfPreloadInterceptor } from './xsrf-preload.interceptor'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { AppEventName } from 'src/app/rum/app-event-names'
import { WINDOW } from 'src/app/cdk/window'
import { Platform } from '@angular/cdk/platform'

describe('XsrfPreloadInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  let cookieGetSpy: jasmine.Spy
  let recordSimpleEventSpy: jasmine.Spy
  let reloadSpy: jasmine.Spy
  let sessionStore: Record<string, string>

  const apiBase = 'http://api/'

  beforeEach(() => {
    ;(window as any).runtimeEnvironment = {
      API_WEB: apiBase,
      BASE_URL: apiBase,
    }

    cookieGetSpy = jasmine.createSpy('get').and.returnValue('')
    recordSimpleEventSpy = jasmine.createSpy('recordSimpleEvent')
    reloadSpy = jasmine.createSpy('reload')
    sessionStore = {}

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: XsrfPreloadInterceptor,
          multi: true,
        },
        { provide: CookieService, useValue: { get: cookieGetSpy } },
        {
          provide: RumJourneyEventService,
          useValue: { recordSimpleEvent: recordSimpleEventSpy },
        },
        {
          provide: WINDOW,
          useValue: {
            location: { reload: reloadSpy },
            sessionStorage: {
              getItem: (k: string) => sessionStore[k] ?? null,
              setItem: (k: string, v: string) => (sessionStore[k] = v),
            },
          },
        },
        { provide: Platform, useValue: { FIREFOX: false, BLINK: true } },
      ],
    })

    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('preloads on a non-Firefox browser, the gap is not Firefox specific', fakeAsync(() => {
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve(new Response())
    )

    http.get(apiBase + 'foo.json').subscribe()
    // The request is held back until the cookie exists
    httpMock.expectNone(apiBase + 'foo.json')

    flushMicrotasks()

    expect(fetchSpy).toHaveBeenCalledWith(apiBase + 'csrf.json', {
      credentials: 'include',
    })
    httpMock.expectOne(apiBase + 'foo.json').flush({ ok: true })
  }))

  it('does not preload when the XSRF cookie already exists', () => {
    cookieGetSpy.and.returnValue('token')
    const fetchSpy = spyOn(window as any, 'fetch')

    http.get(apiBase + 'foo.json').subscribe()
    httpMock.expectOne(apiBase + 'foo.json').flush({ ok: true })

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('only preloads once, later calls go straight through', fakeAsync(() => {
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve(new Response())
    )

    http.get(apiBase + 'foo.json').subscribe()
    flushMicrotasks()
    httpMock.expectOne(apiBase + 'foo.json').flush({ ok: true })

    http.get(apiBase + 'bar.json').subscribe()
    httpMock.expectOne(apiBase + 'bar.json').flush({ ok: true })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  }))

  it('reports and reloads if the cookie is still missing afterwards', fakeAsync(() => {
    cookieGetSpy.and.returnValue('')
    spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve(new Response())
    )

    http.get(apiBase + 'foo.json').subscribe()
    flushMicrotasks()

    expect(recordSimpleEventSpy).toHaveBeenCalledWith(
      AppEventName.XsrfMissingAfterPreload,
      jasmine.objectContaining({ error: 'xsrf_missing', reloaded: true })
    )
    expect(reloadSpy).toHaveBeenCalled()

    httpMock.expectOne(apiBase + 'foo.json').flush({ ok: true })
  }))

  it('reloads at most once so a backend that never sets the cookie cannot loop', fakeAsync(() => {
    sessionStore[XsrfPreloadInterceptor.RELOAD_GUARD_KEY] = 'true'
    cookieGetSpy.and.returnValue('')
    spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve(new Response())
    )

    http.get(apiBase + 'foo.json').subscribe()
    flushMicrotasks()

    expect(reloadSpy).not.toHaveBeenCalled()
    // Still reported, so the failure stays visible in RUM
    expect(recordSimpleEventSpy).toHaveBeenCalledWith(
      AppEventName.XsrfMissingAfterPreload,
      jasmine.objectContaining({ reloaded: false })
    )

    httpMock.expectOne(apiBase + 'foo.json').flush({ ok: true })
  }))

  it('does not gate csrf.json on itself', () => {
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch')

    http.get(apiBase + 'csrf.json').subscribe()
    httpMock.expectOne(apiBase + 'csrf.json').flush({})

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('lets JSON on another host through without a preload', () => {
    // The homepage content bundle is a `.json` file on a static host. It cannot
    // use our XSRF cookie, so gating it would delay the page and could trip the
    // recovery reload for a request that was never ours to protect.
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch')
    const contentUrl =
      'https://orcid.github.io/orcid-homepage-decap-cms/qa/content/home.en.json'

    let received: unknown
    http.get(contentUrl).subscribe((body) => (received = body))
    httpMock.expectOne(contentUrl).flush({ schemaVersion: 1 })

    expect(received).toEqual({ schemaVersion: 1 })
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(reloadSpy).not.toHaveBeenCalled()
  })

  it('still gates our own JSON endpoints', fakeAsync(() => {
    cookieGetSpy.and.returnValue('')
    const fetchSpy = spyOn(window as any, 'fetch').and.returnValue(
      Promise.resolve({} as Response)
    )

    http.get(apiBase + 'foo.json').subscribe()
    httpMock.expectNone(apiBase + 'foo.json')

    flushMicrotasks()
    expect(fetchSpy).toHaveBeenCalledWith(
      apiBase + 'csrf.json',
      jasmine.objectContaining({ credentials: 'include' })
    )
    httpMock.expectOne(apiBase + 'foo.json').flush({ ok: true })
  }))
})
