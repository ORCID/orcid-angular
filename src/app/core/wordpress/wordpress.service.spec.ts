import { TestBed } from '@angular/core/testing'
import { WordpressService } from './wordpress.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { LOCALE_ID } from '@angular/core'


import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WordpressService', () => {
  let service: WordpressService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    })
    service = TestBed.inject(WordpressService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should fetch home page post from primary URL', () => {
    const mockHtml = '<html></html>'
    service.getHomePagePost().subscribe((html) => {
      expect(html).toContain(mockHtml)
    })

    const req = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/index.html`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockHtml)
  })

  it('should fetch home page post from fallback URL when primary fails', () => {
    const mockHtml = '<html></html>'
    service.getHomePagePost().subscribe((html) => {
      expect(html).toContain(mockHtml)
    })

    const primaryReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/index.html`
    )
    primaryReq.flush(null, { status: 500, statusText: 'Server Error' })

    const fallbackReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3_FALLBACK}/index.html`
    )
    expect(fallbackReq.request.method).toBe('GET')
    fallbackReq.flush(mockHtml)
  })

  it('should fetch home page CSS from primary URL', () => {
    const mockCss = 'body { margin: 0; }'
    service.getHomePageCSS().subscribe((css) => {
      expect(css).toContain(mockCss)
    })

    const req = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/wordpress-homepage.css`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockCss)
  })

  it('should fetch home page CSS from fallback URL when primary fails', () => {
    const mockCss = 'body { margin: 0; }'
    service.getHomePageCSS().subscribe((css) => {
      expect(css).toContain(mockCss)
    })

    const primaryReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/wordpress-homepage.css`
    )
    primaryReq.flush(null, { status: 500, statusText: 'Server Error' })

    const fallbackReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3_FALLBACK}/wordpress-homepage.css`
    )
    expect(fallbackReq.request.method).toBe('GET')
    fallbackReq.flush(mockCss)
  })

  it('should fetch home page JS from primary URL', () => {
    const mockJs = 'console.log("Hello, World!");'
    service.getHomePageJS().subscribe((js) => {
      expect(js).toContain(mockJs)
    })

    const req = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/wordpress-homepage.js`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockJs)
  })

  it('should fetch home page JS from fallback URL when primary fails', () => {
    const mockJs = 'console.log("Hello, World!");'
    service.getHomePageJS().subscribe((js) => {
      expect(js).toContain(mockJs)
    })

    const primaryReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/wordpress-homepage.js`
    )
    primaryReq.flush(null, { status: 500, statusText: 'Server Error' })

    const fallbackReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3_FALLBACK}/wordpress-homepage.js`
    )
    expect(fallbackReq.request.method).toBe('GET')
    fallbackReq.flush(mockJs)
  })

  it('should fetch home page post from primary URL and update asset paths', () => {
    const mockHtml =
      '<html><head></head><body><img src="./assets/image.png"></body></html>'
    const expectedHtml = `<html><head></head><body><img src="${runtimeEnvironment.WORDPRESS_S3}/assets/image.png"></body></html>`

    service.getHomePagePost().subscribe((html) => {
      expect(html).toBe(expectedHtml)
    })

    const req = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/index.html`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockHtml)
  })

  it('should fetch home page post from fallback URL and update asset paths when primary fails', () => {
    const mockHtml =
      '<html><head></head><body><img src="./assets/image.png"></body></html>'
    const expectedHtml = `<html><head></head><body><img src="${runtimeEnvironment.WORDPRESS_S3_FALLBACK}/assets/image.png"></body></html>`

    service.getHomePagePost().subscribe((html) => {
      expect(html).toBe(expectedHtml)
    })

    const primaryReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3}/index.html`
    )
    primaryReq.flush(null, { status: 500, statusText: 'Server Error' })

    const fallbackReq = httpMock.expectOne(
      `${runtimeEnvironment.WORDPRESS_S3_FALLBACK}/index.html`
    )
    expect(fallbackReq.request.method).toBe('GET')
    fallbackReq.flush(mockHtml)
  })
})
