import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { PlatformInfoService } from './platform-info.service'
import { WINDOW } from '../window'

interface MockWindow {
  navigator: { userAgent: string }
  location: { search: string; pathname: string; href: string }
}

function createServiceWithUserAgent(userAgent: string): PlatformInfoService {
  const mockWindow: MockWindow = {
    navigator: { userAgent },
    location: {
      search: '',
      pathname: '/',
      href: 'https://example.org/',
    },
  }

  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      { provide: WINDOW, useValue: mockWindow },
      PlatformInfoService,
    ],
  })

  const service = TestBed.inject(PlatformInfoService) as any

  // Override supported browsers with a simple known matrix for the tests.
  // This avoids depending on the generated supported-browsers.json contents.
  service.supportedBrowsers = {
    chrome: { major: 90, minor: 0 },
    firefox: { major: 88, minor: 0 },
    safari: { major: 16, minor: 4 },
    edge: { major: 90, minor: 0 },
  }

  return TestBed.inject(PlatformInfoService)
}

describe('PlatformInfoService', () => {
  it('should be created', () => {
    const service = createServiceWithUserAgent(
      // Chrome 120 on Windows 10
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    expect(service).toBeTruthy()
  })

  it('marks a modern Chrome as supported', () => {
    const service = createServiceWithUserAgent(
      // Chrome 120 on Windows 10
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    const platform = (service as any).platformSubject.value
    expect(platform.unsupportedBrowser).toBeFalse()
  })

  it('marks an old Chrome as unsupported', () => {
    const service = createServiceWithUserAgent(
      // Chrome 70 on Windows 7
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
    )

    const platform = (service as any).platformSubject.value
    expect(platform.unsupportedBrowser).toBeTrue()
  })

  it('marks a modern Firefox as supported', () => {
    const service = createServiceWithUserAgent(
      // Firefox 115 on Windows 10
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0'
    )

    const platform = (service as any).platformSubject.value
    expect(platform.unsupportedBrowser).toBeFalse()
  })

  it('marks an old Safari as unsupported when minimum is 14', () => {
    const service = createServiceWithUserAgent(
      // iOS 12 Safari
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1'
    )

    const platform = (service as any).platformSubject.value
    expect(platform.unsupportedBrowser).toBeTrue()
  })

  it('marks a modern Safari as supported when minimum is 14', () => {
    const service = createServiceWithUserAgent(
      // iOS 16.4 Safari
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1'
    )

    const platform = (service as any).platformSubject.value
    expect(platform.unsupportedBrowser).toBeFalse()
  })

  it('marks Safari 16.3 as unsupported when minimum is 16.4', () => {
    const service = createServiceWithUserAgent(
      // iOS 16.3 Safari
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1'
    )

    const platform = (service as any).platformSubject.value
    expect(platform.unsupportedBrowser).toBeTrue()
  })
})
