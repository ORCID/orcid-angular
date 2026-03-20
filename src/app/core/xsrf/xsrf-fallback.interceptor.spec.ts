import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { CookieService } from 'ngx-cookie-service'
import { XsrfFallbackInterceptor } from './xsrf-fallback.interceptor'

describe('XsrfFallbackInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  let cookieGetSpy: jasmine.Spy

  const apiBase = 'http://api.example/'
  const baseUrl = 'http://orcid.example/'
  const authBase = 'http://auth.example/'

  beforeEach(() => {
    ;(window as any).runtimeEnvironment = {
      production: false,
      API_WEB: apiBase,
      BASE_URL: baseUrl,
      AUTH_SERVER: authBase,
    }
    cookieGetSpy = jasmine.createSpy('get').and.returnValue('')

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: XsrfFallbackInterceptor,
          multi: true,
        },
        { provide: CookieService, useValue: { get: cookieGetSpy } },
      ],
    })

    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('passes through GET requests without adding header', () => {
    http.get(apiBase + 'works/works.json').subscribe()

    const req = httpMock.expectOne(apiBase + 'works/works.json')
    expect(req.request.headers.has('x-xsrf-token')).toBe(false)
    req.flush({})
  })

  it('passes through when x-xsrf-token header is already present', () => {
    cookieGetSpy.and.returnValue('cookie-token')
    http
      .post(
        apiBase + 'works/work.json',
        {},
        {
          headers: { 'x-xsrf-token': 'existing-token' },
        }
      )
      .subscribe()

    const req = httpMock.expectOne(apiBase + 'works/work.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('existing-token')
    req.flush({})
  })

  it('passes through when request URL is not to backend host', () => {
    cookieGetSpy.and.returnValue('token')
    http.post('https://other-origin.com/api', {}).subscribe()

    const req = httpMock.expectOne('https://other-origin.com/api')
    expect(req.request.headers.has('x-xsrf-token')).toBe(false)
    req.flush({})
  })

  it('passes through when cookie is missing', () => {
    cookieGetSpy.and.returnValue('')

    http.post(apiBase + 'works/work.json', {}).subscribe()

    const req = httpMock.expectOne(apiBase + 'works/work.json')
    expect(req.request.headers.has('x-xsrf-token')).toBe(false)
    req.flush({})
  })

  it('adds XSRF-TOKEN for POST to API_WEB when cookie is present', () => {
    cookieGetSpy.and.callFake((name: string) =>
      name === 'XSRF-TOKEN' ? 'api-xsrf-token' : ''
    )

    http.post(apiBase + 'works/work.json', {}).subscribe()

    const req = httpMock.expectOne(apiBase + 'works/work.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('api-xsrf-token')
    expect(req.request.withCredentials).toBe(true)
    req.flush({})
  })

  it('adds AUTH-XSRF-TOKEN for POST to AUTH_SERVER when cookie is present', () => {
    cookieGetSpy.and.callFake((name: string) =>
      name === 'AUTH-XSRF-TOKEN' ? 'auth-xsrf-token' : ''
    )

    http.post(authBase + 'signin/auth.json', {}).subscribe()

    const req = httpMock.expectOne(authBase + 'signin/auth.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('auth-xsrf-token')
    req.flush({})
  })

  it('adds XSRF-TOKEN for relative URL when cookie is present', () => {
    cookieGetSpy.and.returnValue('rel-xsrf-token')

    http.post('/signin/auth.json', {}).subscribe()

    const req = httpMock.expectOne('/signin/auth.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('rel-xsrf-token')
    req.flush({})
  })

  it('passes through PUT and PATCH and DELETE when not production', () => {
    cookieGetSpy.and.returnValue('token')

    http.put(apiBase + 'works/1.json', {}).subscribe()
    let req = httpMock.expectOne(apiBase + 'works/1.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('token')
    req.flush({})

    http.patch(apiBase + 'works/1.json', {}).subscribe()
    req = httpMock.expectOne(apiBase + 'works/1.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('token')
    req.flush({})

    http.delete(apiBase + 'works/1.json').subscribe()
    req = httpMock.expectOne(apiBase + 'works/1.json')
    expect(req.request.headers.get('x-xsrf-token')).toBe('token')
    req.flush({})
  })
})
