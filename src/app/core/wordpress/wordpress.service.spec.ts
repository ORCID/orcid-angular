import { TestBed } from '@angular/core/testing'
import { WordpressService } from './wordpress.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { LOCALE_ID } from '@angular/core'

describe('WordpressService', () => {
  let service: WordpressService
  let httpMock: HttpTestingController
  let originalRuntimeEnvironment: unknown

  const WORDPRESS_S3 = 'https://homepage-qa.orcid.org'
  const WORDPRESS_S3_FALLBACK = 'https://homepage-fallback.orcid.org'
  const primaryIndexUrl = `${WORDPRESS_S3}/index.html`
  const fallbackIndexUrl = `${WORDPRESS_S3_FALLBACK}/index.html`

  beforeEach(() => {
    originalRuntimeEnvironment = (globalThis as any).runtimeEnvironment
    ;(globalThis as any).runtimeEnvironment = {
      ...(originalRuntimeEnvironment as Record<string, unknown> | undefined),
      WORDPRESS_S3,
      WORDPRESS_S3_FALLBACK,
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    })
    service = TestBed.inject(WordpressService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
    ;(globalThis as any).runtimeEnvironment = originalRuntimeEnvironment
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('fetches home page post from primary URL', () => {
    const mockHtml =
      '<html><head></head><body><img src="./assets/image.png"></body></html>'

    service.getHomePagePost().subscribe((html) => {
      expect(html).toContain(`${WORDPRESS_S3}/assets/image.png`)
    })

    const req = httpMock.expectOne(primaryIndexUrl)
    expect(req.request.method).toBe('GET')
    req.flush(mockHtml)
  })

  it('fetches home page post from fallback URL when primary fails', () => {
    const mockHtml = '<html></html>'

    service.getHomePagePost().subscribe((html) => {
      expect(html).toContain(mockHtml)
    })

    const primaryReq = httpMock.expectOne(primaryIndexUrl)
    primaryReq.flush(null, { status: 500, statusText: 'Server Error' })

    const fallbackReq = httpMock.expectOne(fallbackIndexUrl)
    expect(fallbackReq.request.method).toBe('GET')
    fallbackReq.flush(mockHtml)
  })

  it('fetches home page CSS from the stylesheet declared in index.html', () => {
    const mockIndex =
      '<html><head><link href="./wordpress-homepage-d4235c1c61.css" rel="stylesheet" /></head><body></body></html>'
    const mockCss = '.hero{background:url("assets/bg.png")}'

    service.getHomePageCSS().subscribe((css) => {
      expect(css).toContain(`${WORDPRESS_S3}/assets/bg.png`)
    })

    const indexReq = httpMock.expectOne(primaryIndexUrl)
    indexReq.flush(mockIndex)
    const cssReq = httpMock.expectOne(
      `${WORDPRESS_S3}/wordpress-homepage-d4235c1c61.css`
    )
    cssReq.flush(mockCss)
  })

  it('falls back to legacy CSS path if index.html has no stylesheet', () => {
    const mockIndex = '<html><head></head><body></body></html>'
    const mockCss = 'body{margin:0}'

    service.getHomePageCSS().subscribe((css) => {
      expect(css).toContain(mockCss)
    })

    const indexReq = httpMock.expectOne(primaryIndexUrl)
    indexReq.flush(mockIndex)
    const cssReq = httpMock.expectOne(
      `${WORDPRESS_S3}/wordpress-homepage.css`
    )
    cssReq.flush(mockCss)
  })

  it('fetches home page JS from script declared in index.html', () => {
    const mockIndex =
      '<html><head><script defer src="./wordpress-homepage-64bd37a0a7.js"></script></head><body></body></html>'
    const mockJs = 'const image = "./assets/test.png"'

    service.getHomePageJS().subscribe((js) => {
      expect(js).toContain(
        `const image = "${WORDPRESS_S3}/assets/test.png"`
      )
    })

    const indexReq = httpMock.expectOne(primaryIndexUrl)
    indexReq.flush(mockIndex)
    const jsReq = httpMock.expectOne(
      `${WORDPRESS_S3}/wordpress-homepage-64bd37a0a7.js`
    )
    jsReq.flush(mockJs)
  })

  it('fetches module JS from script declared in index.html', () => {
    const mockIndex =
      '<html><head><script type="module" src="./wordpress-homepage-modules-34238353bb.js"></script></head><body></body></html>'
    const mockJs = 'const icon = "./assets/icon.svg"'

    service.getHomePageModulesJS().subscribe((js) => {
      expect(js).toContain(
        `const icon = "${WORDPRESS_S3}/assets/icon.svg"`
      )
    })

    const indexReq = httpMock.expectOne(primaryIndexUrl)
    indexReq.flush(mockIndex)
    const jsReq = httpMock.expectOne(
      `${WORDPRESS_S3}/wordpress-homepage-modules-34238353bb.js`
    )
    jsReq.flush(mockJs)
  })
})
