import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { WINDOW } from '../../cdk/window'
import { SessionExpiredInterceptor } from './session-expired.interceptor'

describe('SessionExpiredInterceptor', () => {
  let http: HttpClient
  let requests: HttpTestingController
  const assign = jasmine.createSpy('assign')
  const statusUrl = runtimeEnvironment.API_WEB + 'userStatus.json'
  const saveUrl = runtimeEnvironment.API_WEB + 'keywords.json'

  beforeEach(() => {
    assign.calls.reset()
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: WINDOW, useValue: { location: { assign } } },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SessionExpiredInterceptor,
          multi: true,
        },
      ],
    })
    http = TestBed.inject(HttpClient)
    requests = TestBed.inject(HttpTestingController)
  })
  afterEach(() => requests.verify())

  function signedIn() {
    http.get(statusUrl).subscribe()
    requests.expectOne(statusUrl).flush({ loggedIn: true })
  }

  it('redirects when a status response reports an expired session', () => {
    signedIn()
    let response: any
    http.get(statusUrl).subscribe((status) => (response = status))
    requests
      .expectOne(statusUrl)
      .flush({ loggedIn: false }, { status: 205, statusText: 'Reset Content' })
    expect(assign).toHaveBeenCalledOnceWith('/signin')
    expect(response.loggedIn).toBeFalse()
  })

  it('redirects when the OAuth status reports an expired session', () => {
    signedIn()
    const oauthStatus = runtimeEnvironment.AUTH_SERVER + 'userStatus.json'
    http.get(oauthStatus).subscribe()
    requests.expectOne(oauthStatus).flush({ loggedIn: false })
    expect(assign).toHaveBeenCalledOnceWith('/signin')
  })

  it('does not redirect anonymous visitors or intentional sign-outs', () => {
    http.get(statusUrl).subscribe()
    requests.expectOne(statusUrl).flush({ loggedIn: false })
    signedIn()
    const logoutUrl = statusUrl + '?logUserOut=true'
    http.get(logoutUrl).subscribe()
    requests.expectOne(logoutUrl).flush({ loggedIn: false })
    http.get(statusUrl).subscribe()
    requests.expectOne(statusUrl).flush({ loggedIn: false })
    expect(assign).not.toHaveBeenCalled()
  })

  it('redirects after a modal request fails and the session is gone', () => {
    signedIn()
    let originalError: any
    http
      .post(saveUrl, {})
      .subscribe({ error: (error) => (originalError = error) })
    requests
      .expectOne(saveUrl)
      .flush('Forbidden', { status: 403, statusText: 'Forbidden' })
    requests.expectOne(statusUrl).flush({ loggedIn: false })
    expect(assign).toHaveBeenCalledOnceWith('/signin')
    expect(originalError.status).toBe(403)
  })

  it('preserves failures when the session remains active or the check fails', () => {
    signedIn()
    for (const active of [true, false]) {
      let originalError: any
      http
        .post(saveUrl, {})
        .subscribe({ error: (error) => (originalError = error) })
      requests
        .expectOne(saveUrl)
        .flush('Forbidden', { status: 403, statusText: 'Forbidden' })
      const check = requests.expectOne(statusUrl)
      if (active) check.flush({ loggedIn: true })
      else
        check.flush('Unavailable', { status: 503, statusText: 'Unavailable' })
      expect(originalError.status).toBe(403)
    }
    expect(assign).not.toHaveBeenCalled()
  })

  it('does not interfere with anonymous requests or external services', () => {
    http.post(saveUrl, {}).subscribe({ error: () => {} })
    requests
      .expectOne(saveUrl)
      .flush('Forbidden', { status: 403, statusText: 'Forbidden' })
    signedIn()
    http
      .post('https://external.example/test', {})
      .subscribe({ error: () => {} })
    requests
      .expectOne('https://external.example/test')
      .flush('Forbidden', { status: 403, statusText: 'Forbidden' })
    requests.expectNone(statusUrl)
    expect(assign).not.toHaveBeenCalled()
  })

  it('handles a parse failure after OAuth status reported a signed-in user', () => {
    const oauthStatus = runtimeEnvironment.AUTH_SERVER + 'userStatus.json'
    http.get(oauthStatus).subscribe()
    requests.expectOne(oauthStatus).flush({ loggedIn: true })
    http.post(saveUrl, {}).subscribe({ error: () => {} })
    requests
      .expectOne(saveUrl)
      .error(new ProgressEvent('error'), { status: 200, statusText: 'OK' })
    requests.expectOne(statusUrl).flush({ loggedIn: false })
    expect(assign).toHaveBeenCalledOnceWith('/signin')
  })

  it('redirects only once for concurrent failed requests', () => {
    signedIn()
    http.post(saveUrl, {}).subscribe({ error: () => {} })
    http.post(saveUrl, {}).subscribe({ error: () => {} })
    requests
      .match(saveUrl)
      .forEach((request) =>
        request.flush('Forbidden', { status: 403, statusText: 'Forbidden' })
      )
    const checks = requests.match(statusUrl)
    expect(checks.length).toBe(2)
    checks.forEach((request) => request.flush({ loggedIn: false }))
    expect(assign).toHaveBeenCalledOnceWith('/signin')
  })
})
