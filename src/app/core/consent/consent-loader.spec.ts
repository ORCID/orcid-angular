import { QaFlag } from '../qa-flag/qa-flags.enum'

/**
 * Covers scripts/onetrust.runtime.js, which Karma bundles as a global script
 * exactly as the application build does. Every function takes the window,
 * storage and document it acts on, so these specs drive it with fakes.
 */
describe('consent loader (scripts/onetrust.runtime.js)', () => {
  const consent = (window as any).orcidConsent
  const QA = 'qa.orcid.org'
  let storage: Storage
  let store: Record<string, string>

  const production = {
    debugger: false,
    ONE_TRUST: 'one-trust-key',
    COOKIE_YES: '',
  }
  const qa = {
    debugger: true,
    ONE_TRUST: 'one-trust-test-key',
    COOKIE_YES: 'cookie-yes-key',
  }

  function chooseVendor(
    environment: any,
    search: string,
    hostname = QA,
    s: Storage | null = storage
  ) {
    return consent.chooseVendor(environment, search, s, hostname)
  }

  function fakeDocument() {
    const appended: { src: string; attributes: Record<string, string> }[] = []
    const doc = {
      createElement: () => {
        const attributes: Record<string, string> = {}
        return {
          attributes,
          setAttribute: (name: string, value: string) =>
            (attributes[name] = value),
        }
      },
      head: { appendChild: (element: any) => appended.push(element) },
    }
    return { doc, appended }
  }

  function fakeWindow(environment: any, search = '', inFrame = false) {
    const { doc, appended } = fakeDocument()
    const top = {}
    const win: any = {
      top,
      runtimeEnvironment: environment,
      location: { search, hostname: QA },
      localStorage: storage,
      document: doc,
    }
    win.self = inFrame ? {} : top
    return { win, appended }
  }

  beforeEach(() => {
    store = {}
    storage = {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => (store[key] = value),
      removeItem: (key: string) => delete store[key],
    } as unknown as Storage
  })

  it('stores its opt-in under the QA flag setQAflag writes (R3)', () => {
    expect(consent.OPT_IN_KEY).toBe(QaFlag.useCookieYesConsent)
  })

  describe('choosing a vendor', () => {
    describe('in production (R1)', () => {
      it('loads OneTrust', () => {
        expect(chooseVendor(production, '', 'orcid.org')).toBe('onetrust')
      })

      it('ignores an opt-in already stored in the browser', () => {
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(chooseVendor(production, '', 'orcid.org')).toBe('onetrust')
      })

      it('ignores ?cookieyes=true and stores nothing', () => {
        expect(chooseVendor(production, '?cookieyes=true', 'orcid.org')).toBe(
          'onetrust'
        )
        expect(store).toEqual({})
      })

      it('stays on OneTrust in a debugging environment with no key', () => {
        // Only the empty key stops it here: the host is QA's, the environment
        // debugs, and the browser has opted in.
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(
          chooseVendor({ ...qa, COOKIE_YES: '' }, '?cookieyes=true', QA)
        ).toBe('onetrust')
      })

      it('stays on OneTrust if a key reached a non-debugging environment', () => {
        // Only the debugger flag stops it here: the key is set, the host is
        // QA's, and the browser has opted in.
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(
          chooseVendor({ ...qa, debugger: false }, '?cookieyes=true', QA)
        ).toBe('onetrust')
      })

      it('loads OneTrust when there is no environment at all', () => {
        expect(chooseVendor(undefined, '?cookieyes=true')).toBe('onetrust')
      })
    })

    describe('where CookieYes is configured', () => {
      it('still defaults to OneTrust (R2)', () => {
        expect(chooseVendor(qa, '')).toBe('onetrust')
        expect(chooseVendor(qa, '?other=param')).toBe('onetrust')
      })

      it('switches to CookieYes on ?cookieyes=true and remembers it (R3)', () => {
        expect(chooseVendor(qa, '?cookieyes=true')).toBe('cookieyes')
        expect(store[QaFlag.useCookieYesConsent]).toBe('true')
        expect(chooseVendor(qa, '')).toBe('cookieyes')
      })

      it('honours the QA flag set with setQAflag (R3)', () => {
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(chooseVendor(qa, '')).toBe('cookieyes')
      })

      it('switches back to OneTrust on ?cookieyes=false (R3)', () => {
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(chooseVendor(qa, '?lang=en&cookieyes=false')).toBe('onetrust')
        expect(QaFlag.useCookieYesConsent in store).toBeFalse()
      })

      it('ignores any other value of the parameter (R3)', () => {
        expect(chooseVendor(qa, '?cookieyes=1')).toBe('onetrust')
        expect(store).toEqual({})
      })

      it('loads CookieYes only on QA and development hosts', () => {
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(chooseVendor(qa, '', 'qa.orcid.org')).toBe('cookieyes')
        expect(chooseVendor(qa, '', 'dev.orcid.org')).toBe('cookieyes')
        expect(chooseVendor(qa, '', 'cookieyes-poc.dev.orcid.org')).toBe(
          'cookieyes'
        )
        expect(chooseVendor(qa, '', 'localhost')).toBe('onetrust')
        expect(chooseVendor(qa, '', 'orcid.org.example.com')).toBe('onetrust')
        expect(chooseVendor(qa, '', 'evilqa.orcid.org')).toBe('onetrust')
      })

      it('never loads on production or sandbox hosts (R1)', () => {
        store[QaFlag.useCookieYesConsent] = 'true'

        expect(chooseVendor(qa, '?cookieyes=true', 'orcid.org')).toBe(
          'onetrust'
        )
        expect(chooseVendor(qa, '?cookieyes=true', 'www.orcid.org')).toBe(
          'onetrust'
        )
        expect(chooseVendor(qa, '?cookieyes=true', 'sandbox.orcid.org')).toBe(
          'onetrust'
        )
      })

      it('falls back to OneTrust when storage is unavailable', () => {
        expect(chooseVendor(qa, '?cookieyes=true', QA, null)).toBe('onetrust')
      })

      it('falls back to OneTrust when storage throws', () => {
        const blocked = () => {
          throw new Error('blocked')
        }
        const throwing = {
          getItem: blocked,
          setItem: blocked,
          removeItem: blocked,
        } as unknown as Storage

        expect(chooseVendor(qa, '?cookieyes=true', QA, throwing)).toBe(
          'onetrust'
        )
      })
    })
  })

  describe('loading a vendor (R4)', () => {
    it('adds only the CookieYes script for CookieYes', () => {
      const { doc, appended } = fakeDocument()
      consent.loadVendor(qa, 'cookieyes', doc)

      expect(appended.map((script) => script.src)).toEqual([
        'https://cdn-cookieyes.com/client_data/cookie-yes-key/script.js',
      ])
    })

    it('adds only the two OneTrust scripts, as before, for OneTrust', () => {
      const { doc, appended } = fakeDocument()
      consent.loadVendor(qa, 'onetrust', doc)

      expect(appended.map((script) => script.src)).toEqual([
        'https://cdn.cookielaw.org/consent/one-trust-test-key/OtAutoBlock.js',
        'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      ])
      expect(appended[1].attributes).toEqual({
        'data-document-language': 'true',
        'data-domain-script': 'one-trust-test-key',
      })
    })

    it('adds nothing for OneTrust when the environment has no OneTrust key', () => {
      const { doc, appended } = fakeDocument()
      consent.loadVendor({ ...qa, ONE_TRUST: '' }, 'onetrust', doc)

      expect(appended).toEqual([])
    })
  })

  describe('starting on a page', () => {
    it('loads nothing inside an iframe (R12)', () => {
      const { win, appended } = fakeWindow(qa, '?cookieyes=true', true)

      expect(consent.start(win)).toBeFalse()
      expect(appended).toEqual([])
      expect(win.orcidConsent).toBeUndefined()
      expect(store).toEqual({})
    })

    it('publishes the vendor it chose and loads it (R3, R4)', () => {
      const { win, appended } = fakeWindow(qa, '?cookieyes=true')

      expect(consent.start(win)).toBeTrue()
      expect(win.orcidConsent.vendor).toBe('cookieyes')
      expect(appended.length).toBe(1)
    })

    it('loads OneTrust exactly as before in production (R1)', () => {
      const { win, appended } = fakeWindow(production, '?cookieyes=true')
      win.location.hostname = 'orcid.org'
      consent.start(win)

      expect(win.orcidConsent.vendor).toBe('onetrust')
      expect(
        appended.map(({ src, type, charset, attributes }: any) => ({
          src,
          type,
          charset,
          attributes,
        }))
      ).toEqual([
        {
          src: 'https://cdn.cookielaw.org/consent/one-trust-key/OtAutoBlock.js',
          type: 'text/javascript',
          charset: undefined,
          attributes: {},
        },
        {
          src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
          type: 'text/javascript',
          charset: 'UTF-8',
          attributes: {
            'data-document-language': 'true',
            'data-domain-script': 'one-trust-key',
          },
        },
      ])
      expect(store).toEqual({})
    })

    it('loads OneTrust on a production host (R1)', () => {
      store[QaFlag.useCookieYesConsent] = 'true'
      const { win, appended } = fakeWindow(qa, '?cookieyes=true')
      win.location.hostname = 'orcid.org'
      consent.start(win)

      expect(win.orcidConsent.vendor).toBe('onetrust')
      expect(appended.every((script) => /cookielaw/.test(script.src))).toBe(
        true
      )
    })

    it('waits for the runtime environment before choosing', () => {
      jasmine.clock().install()
      try {
        const { win, appended } = fakeWindow(undefined)
        consent.start(win)
        expect(appended).toEqual([])

        win.runtimeEnvironment = qa
        jasmine.clock().tick(50)

        expect(win.orcidConsent.vendor).toBe('onetrust')
        expect(appended.length).toBe(2)
      } finally {
        jasmine.clock().uninstall()
      }
    })

    it('has not loaded a consent manager into the test page itself (R12)', () => {
      const consentScripts = Array.from(
        document.querySelectorAll('script[src]')
      ).filter((script) =>
        /cdn\.cookielaw\.org|cdn-cookieyes\.com/.test(
          script.getAttribute('src')
        )
      )
      if (window.self === window.top) {
        pending('Karma is not running the specs in an iframe')
      }
      expect(consentScripts).toEqual([])
    })
  })
})
