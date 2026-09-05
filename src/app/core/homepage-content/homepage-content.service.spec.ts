import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { LOCALE_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { HomepageContentService } from './homepage-content.service'

describe('HomepageContentService', () => {
  let httpMock: HttpTestingController
  let originalRuntimeEnvironment: unknown

  const BASE = 'https://orcid.github.io/orcid-homepage-decap-cms/qa/content'

  function validContent(overrides: Record<string, unknown> = {}) {
    return {
      schemaVersion: 2,
      catalogueVersion: 1,
      page: { title: 'ORCID is for…', description: 'One sentence.' },
      sections: [
        {
          id: 'who-we-serve',
          type: 'audience-selector',
          variant: 'tabs-photo',
          layout: { span: 'full', spacing: 'normal', tone: 'brand-dark' },
          audiences: [
            {
              id: 'researchers',
              label: 'Researchers',
              intro: 'Intro text',
              background: { src: 'assets/kaya-abc1234567.png' },
              features: [
                {
                  id: 'uniquely-yours',
                  title: 'Uniquely Yours',
                  body: 'Feature text',
                  icon: { src: 'assets/icon-abc1234567.png' },
                },
              ],
            },
          ],
        },
      ],
      ...overrides,
    }
  }

  function configure(locale: string, contentUrl?: string) {
    ;(globalThis as any).runtimeEnvironment = {
      ...(originalRuntimeEnvironment as Record<string, unknown> | undefined),
      HOMEPAGE_CONTENT_URL: contentUrl,
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LOCALE_ID, useValue: locale }],
    })

    httpMock = TestBed.inject(HttpTestingController)
    return TestBed.inject(HomepageContentService)
  }

  beforeEach(() => {
    originalRuntimeEnvironment = (globalThis as any).runtimeEnvironment
  })

  afterEach(() => {
    httpMock?.verify()
    ;(globalThis as any).runtimeEnvironment = originalRuntimeEnvironment
    TestBed.resetTestingModule()
  })

  describe('isEnabled', () => {
    it('is false when no content URL is configured', () => {
      expect(configure('en', undefined).isEnabled()).toBeFalse()
    })

    it('is false for an empty or blank URL', () => {
      expect(configure('en', '').isEnabled()).toBeFalse()
      TestBed.resetTestingModule()
      expect(configure('en', '   ').isEnabled()).toBeFalse()
    })

    it('is true when a content URL is configured', () => {
      expect(configure('en', BASE).isEnabled()).toBeTrue()
    })
  })

  it('requests the English document for an English locale', () => {
    const service = configure('en', BASE)
    service.getContent().subscribe()

    httpMock.expectOne(`${BASE}/home.en.json`).flush(validContent())
  })

  it('requests the document for the current locale', () => {
    const service = configure('cs', BASE)
    service.getContent().subscribe()

    httpMock.expectOne(`${BASE}/home.cs.json`).flush(validContent())
  })

  it('keeps the hyphenated locale code used by the content bundle', () => {
    const service = configure('zh-CN', BASE)
    service.getContent().subscribe()

    httpMock.expectOne(`${BASE}/home.zh-CN.json`).flush(validContent())
  })

  it('tolerates a trailing slash on the configured URL', () => {
    const service = configure('en', `${BASE}/`)
    service.getContent().subscribe()

    httpMock.expectOne(`${BASE}/home.en.json`).flush(validContent())
  })

  it('sends no headers and no credentials, so the request stays a simple CORS GET', () => {
    const service = configure('en', BASE)
    service.getContent().subscribe()

    const request = httpMock.expectOne(`${BASE}/home.en.json`)
    expect(request.request.headers.keys()).toEqual([])
    expect(request.request.withCredentials).toBeFalse()
    expect(request.request.method).toBe('GET')
    request.flush(validContent())
  })

  it('falls back to English when the locale document is missing', () => {
    const service = configure('cs', BASE)
    let received: unknown

    service.getContent().subscribe((content) => (received = content))

    httpMock
      .expectOne(`${BASE}/home.cs.json`)
      .flush('missing', { status: 404, statusText: 'Not Found' })
    httpMock.expectOne(`${BASE}/home.en.json`).flush(validContent())

    expect(received).toBeTruthy()
  })

  it('does not retry English when English itself fails', () => {
    const service = configure('en', BASE)
    let failure: Error | undefined

    service.getContent().subscribe({ error: (e) => (failure = e) })

    httpMock
      .expectOne(`${BASE}/home.en.json`)
      .flush('boom', { status: 500, statusText: 'Server Error' })

    expect(failure).toBeTruthy()
  })

  it('refuses a document from an unknown schema version', () => {
    const service = configure('en', BASE)
    let failure: Error | undefined

    service.getContent().subscribe({ error: (e) => (failure = e) })

    httpMock
      .expectOne(`${BASE}/home.en.json`)
      .flush(validContent({ schemaVersion: 9 }))

    expect(failure?.message).toContain('schemaVersion')
  })

  it('refuses a document that is missing the pieces the page renders', () => {
    const service = configure('en', BASE)
    let failure: Error | undefined

    service.getContent().subscribe({ error: (e) => (failure = e) })

    httpMock
      .expectOne(`${BASE}/home.en.json`)
      .flush(validContent({ page: undefined }))

    expect(failure).toBeTruthy()
  })

  it('resolves image paths against the document that supplied them', () => {
    const service = configure('en', BASE)
    let received: any

    service.getContent().subscribe((content) => (received = content))
    httpMock.expectOne(`${BASE}/home.en.json`).flush(validContent())

    expect(received.sections[0].audiences[0].background.src).toBe(
      `${BASE}/assets/kaya-abc1234567.png`
    )
    expect(received.sections[0].audiences[0].features[0].icon.src).toBe(
      `${BASE}/assets/icon-abc1234567.png`
    )
  })

  it('resolves images against the English document when it fell back', () => {
    const service = configure('cs', BASE)
    let received: any

    service.getContent().subscribe((content) => (received = content))
    httpMock
      .expectOne(`${BASE}/home.cs.json`)
      .flush('missing', { status: 404, statusText: 'Not Found' })
    httpMock.expectOne(`${BASE}/home.en.json`).flush(validContent())

    expect(received.sections[0].audiences[0].features[0].icon.src).toBe(
      `${BASE}/assets/icon-abc1234567.png`
    )
  })

  it('fetches once however many subscribers there are', () => {
    const service = configure('en', BASE)

    service.getContent().subscribe()
    service.getContent().subscribe()

    httpMock.expectOne(`${BASE}/home.en.json`).flush(validContent())
  })

  it('errors without a request when no content URL is configured', () => {
    const service = configure('en', undefined)
    let failure: Error | undefined

    service.getContent().subscribe({ error: (e) => (failure = e) })

    expect(failure).toBeTruthy()
    httpMock.expectNone(() => true)
  })
})
