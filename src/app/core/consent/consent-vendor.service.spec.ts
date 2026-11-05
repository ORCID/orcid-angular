import { TestBed } from '@angular/core/testing'
import { WINDOW } from 'src/app/cdk/window'
import {
  COOKIE_YES_CATEGORIES,
  COOKIE_YES_TEST_COOKIE_PREFIX,
  ConsentVendorService,
} from './consent-vendor.service'

describe('ConsentVendorService', () => {
  let fakeWindow: any
  let categories: Record<string, boolean>

  function createService(): ConsentVendorService {
    TestBed.configureTestingModule({
      providers: [{ provide: WINDOW, useValue: fakeWindow }],
    })
    return TestBed.inject(ConsentVendorService)
  }

  function testCookies(): string[] {
    return document.cookie
      .split(';')
      .map((cookie) => cookie.trim().split('=')[0])
      .filter((name) => name.startsWith(COOKIE_YES_TEST_COOKIE_PREFIX))
      .map((name) => name.substring(COOKIE_YES_TEST_COOKIE_PREFIX.length))
      .sort()
  }

  function clearTestCookies(): void {
    for (const category of COOKIE_YES_CATEGORIES) {
      document.cookie = `${COOKIE_YES_TEST_COOKIE_PREFIX}${category}=; path=/; max-age=0`
    }
  }

  beforeEach(() => {
    clearTestCookies()
    categories = {
      necessary: true,
      functional: false,
      analytics: false,
      performance: false,
      advertisement: false,
    }
    fakeWindow = {
      location: { protocol: 'http:' },
      orcidConsent: { vendor: 'cookieyes' },
      getCkyConsent: () => ({ categories }),
      revisitCkyConsent: jasmine.createSpy('revisitCkyConsent'),
    }
  })

  afterEach(() => {
    TestBed.inject(ConsentVendorService).ngOnDestroy()
    clearTestCookies()
  })

  describe('while OneTrust is the vendor', () => {
    it('treats a page the loader never decided as OneTrust', () => {
      delete fakeWindow.orcidConsent
      const service = createService()

      expect(service.vendor).toBe('onetrust')
      expect(service.isCookieYes()).toBeFalse()
    })

    it('does not open CookieYes from the footer link (R6)', () => {
      fakeWindow.orcidConsent.vendor = 'onetrust'
      createService().openPreferences()

      expect(fakeWindow.revisitCkyConsent).not.toHaveBeenCalled()
    })

    it("leaves the footer link's events to OneTrust (R1)", () => {
      fakeWindow.orcidConsent.vendor = 'onetrust'
      const enter = new KeyboardEvent('keydown', {
        key: 'Enter',
        cancelable: true,
      })
      createService().openPreferences(enter)

      expect(enter.defaultPrevented).toBeFalse()
    })

    it('clears test cookies left by an earlier CookieYes visit', () => {
      fakeWindow.orcidConsent.vendor = 'onetrust'
      fakeWindow.runtimeEnvironment = { COOKIE_YES: 'cookie-yes-key' }
      document.cookie = `${COOKIE_YES_TEST_COOKIE_PREFIX}analytics=granted; path=/`
      createService().init()

      expect(testCookies()).toEqual([])
    })

    it('never touches cookies where CookieYes cannot run (R1)', () => {
      fakeWindow.orcidConsent.vendor = 'onetrust'
      fakeWindow.runtimeEnvironment = { COOKIE_YES: '' }
      document.cookie = `${COOKIE_YES_TEST_COOKIE_PREFIX}analytics=granted; path=/`
      createService().init()

      expect(testCookies()).toEqual(['analytics'])
    })

    it('sets no test cookies, even when consent events fire (R8)', () => {
      fakeWindow.orcidConsent.vendor = 'onetrust'
      categories.analytics = true
      createService().init()
      document.dispatchEvent(new CustomEvent('cookieyes_consent_update'))

      expect(testCookies()).toEqual([])
    })
  })

  describe('while CookieYes is the vendor', () => {
    it('opens the preference centre exactly once per call (R6)', () => {
      createService().openPreferences()

      expect(fakeWindow.revisitCkyConsent).toHaveBeenCalledTimes(1)
    })

    it("prevents the Enter keypress from activating the dialog's first control (R6)", () => {
      const enter = new KeyboardEvent('keydown', {
        key: 'Enter',
        cancelable: true,
      })
      createService().openPreferences(enter)

      expect(enter.defaultPrevented).toBeTrue()
      expect(fakeWindow.revisitCkyConsent).toHaveBeenCalledTimes(1)
    })

    it('ignores a held-down Enter key (R6)', () => {
      const repeat = new KeyboardEvent('keydown', {
        key: 'Enter',
        repeat: true,
        cancelable: true,
      })
      createService().openPreferences(repeat)

      expect(repeat.defaultPrevented).toBeTrue()
      expect(fakeWindow.revisitCkyConsent).not.toHaveBeenCalled()
    })

    it('does not throw before the CookieYes script has loaded (R13)', () => {
      delete fakeWindow.revisitCkyConsent
      delete fakeWindow.getCkyConsent
      const service = createService()

      expect(() => service.openPreferences()).not.toThrow()
      expect(() => service.init()).not.toThrow()
      expect(testCookies()).toEqual([])
    })

    it('leaves only the necessary test cookie after Reject all (R8)', () => {
      createService().init()

      expect(testCookies()).toEqual(['necessary'])
    })

    it('sets every test cookie after Accept all (R8)', () => {
      createService().init()
      for (const category of COOKIE_YES_CATEGORIES) {
        categories[category] = true
      }
      document.dispatchEvent(new CustomEvent('cookieyes_consent_update'))

      expect(testCookies()).toEqual([...COOKIE_YES_CATEGORIES].sort())
    })

    it('sets exactly the category that was saved (R8)', () => {
      createService().init()
      categories.performance = true
      document.dispatchEvent(new CustomEvent('cookieyes_consent_update'))

      expect(testCookies()).toEqual(['necessary', 'performance'])
    })

    it('picks up consent given before the app bootstrapped (R8)', () => {
      categories.functional = true
      createService().init()

      expect(testCookies()).toEqual(['functional', 'necessary'])
    })

    it('deletes the test cookie of a withdrawn category (R9)', () => {
      categories.analytics = true
      createService().init()
      expect(testCookies()).toEqual(['analytics', 'necessary'])

      categories.analytics = false
      document.dispatchEvent(new CustomEvent('cookieyes_consent_update'))

      expect(testCookies()).toEqual(['necessary'])
    })

    it('reacts to the banner loading as well as to updates (R8)', () => {
      createService().init()
      categories.advertisement = true
      document.dispatchEvent(new CustomEvent('cookieyes_banner_load'))

      expect(testCookies()).toEqual(['advertisement', 'necessary'])
    })

    it('stops listening once destroyed', () => {
      const service = createService()
      service.init()
      service.ngOnDestroy()
      categories.analytics = true
      document.dispatchEvent(new CustomEvent('cookieyes_consent_update'))

      expect(testCookies()).toEqual(['necessary'])
    })
  })
})
