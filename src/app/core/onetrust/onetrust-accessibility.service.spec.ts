import { TestBed } from '@angular/core/testing'
import { AnnouncerService } from '../announcer/announcer.service'
import {
  ConsentVendor,
  ConsentVendorService,
} from '../consent/consent-vendor.service'
import { OneTrustAccessibilityService } from './onetrust-accessibility.service'

describe('OneTrustAccessibilityService', () => {
  let vendor: ConsentVendor
  let announcer: jasmine.SpyObj<AnnouncerService>
  let trigger: HTMLButtonElement
  let added: HTMLElement[]

  function createService(): OneTrustAccessibilityService {
    announcer = jasmine.createSpyObj('AnnouncerService', ['liveAnnounce'], {
      oneTrustFocusAnnouncement: 'Cookie consent dialog opened',
    })
    TestBed.configureTestingModule({
      providers: [
        { provide: AnnouncerService, useValue: announcer },
        {
          provide: ConsentVendorService,
          useValue: {
            get vendor() {
              return vendor
            },
          },
        },
      ],
    })
    const service = TestBed.inject(OneTrustAccessibilityService)
    service.init()
    return service
  }

  function addToPage(html: string): HTMLElement {
    const container = document.createElement('div')
    container.innerHTML = html
    const element = container.firstElementChild as HTMLElement
    document.body.appendChild(element)
    added.push(element)
    return element
  }

  /** MutationObserver callbacks run after the current task. */
  function settle(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve))
  }

  const cookieYesPreferenceCentre = `
    <div data-cky-tag="detail" role="dialog" aria-modal="true">
      <button id="cky-save">Save my preferences</button>
      <button id="cky-close">Close</button>
    </div>`
  const oneTrustPreferenceCentre = `
    <div id="onetrust-pc-sdk">
      <div role="dialog"><button id="ot-save">Confirm my choices</button></div>
    </div>`

  beforeEach(() => {
    added = []
    trigger = document.createElement('button')
    trigger.textContent = 'Cookie Settings'
    document.body.appendChild(trigger)
    added.push(trigger)
    trigger.focus()
  })

  afterEach(() => {
    TestBed.inject(OneTrustAccessibilityService).ngOnDestroy()
    added.forEach((element) => element.remove())
  })

  describe('while CookieYes is the vendor (R7)', () => {
    beforeEach(() => (vendor = 'cookieyes'))

    it('moves focus into the preference centre and announces it', async () => {
      createService()
      addToPage(cookieYesPreferenceCentre)
      await settle()

      expect(document.activeElement?.id).toBe('cky-save')
      expect(announcer.liveAnnounce).toHaveBeenCalledWith(
        'Cookie consent dialog opened'
      )
    })

    it('wraps Tab from the last control back to the first', async () => {
      createService()
      addToPage(cookieYesPreferenceCentre)
      await settle()
      ;(document.getElementById('cky-close') as HTMLElement).focus()

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
      )

      expect(document.activeElement?.id).toBe('cky-save')
    })

    it('wraps Shift+Tab from the first control to the last', async () => {
      createService()
      addToPage(cookieYesPreferenceCentre)
      await settle()

      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          cancelable: true,
        })
      )

      expect(document.activeElement?.id).toBe('cky-close')
    })

    it('keeps the first control in the Tab order (R7)', async () => {
      createService()
      addToPage(cookieYesPreferenceCentre)
      await settle()

      expect(
        (document.getElementById('cky-save') as HTMLElement).tabIndex
      ).toBe(0)
    })

    it('returns focus to the trigger when the preference centre closes', async () => {
      createService()
      const dialog = addToPage(cookieYesPreferenceCentre)
      await settle()

      dialog.style.display = 'none'
      await settle()

      expect(document.activeElement).toBe(trigger)
    })

    describe('with the preference centre fading in and out as CookieYes does', () => {
      // CookieYes opens and closes its preference centre by toggling
      // cky-modal-open on .cky-modal, whose visibility transitions over a
      // second. The same shape with a shorter transition keeps the spec quick.
      const fadingPreferenceCentre = `
        <div class="cky-modal">
          <style>
            .cky-modal { visibility: hidden; opacity: 0; transition: all 0.3s ease; }
            .cky-modal.cky-modal-open { visibility: visible; opacity: 1; }
          </style>
          <div data-cky-tag="detail" role="dialog" aria-modal="true">
            <button id="cky-fade-close">Close</button>
            <button id="cky-fade-save">Save my preferences</button>
            <div id="cky-fade-accordion">Analytics</div>
          </div>
        </div>`
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))
      /** Waits for the transition and the re-checks, however loaded the machine. */
      async function waitUntil(done: () => boolean, ms = 4000) {
        const end = Date.now() + ms
        while (!done() && Date.now() < end) {
          await wait(25)
        }
      }
      const focusInsideDialog = () =>
        !!document
          .querySelector('[data-cky-tag="detail"]')
          ?.contains(document.activeElement)

      async function openFading(): Promise<HTMLElement> {
        createService()
        const modal = addToPage(fadingPreferenceCentre)
        await settle()
        trigger.focus()
        modal.classList.add('cky-modal-open')
        await waitUntil(focusInsideDialog)
        return modal
      }

      it('notices the preference centre once it has faded in (R7)', async () => {
        await openFading()

        expect(document.activeElement?.id).toBe('cky-fade-close')
        expect(announcer.liveAnnounce).toHaveBeenCalledOnceWith(
          'Cookie consent dialog opened'
        )
      })

      it('returns focus to the trigger once it has faded out (R7)', async () => {
        const modal = await openFading()

        modal.classList.remove('cky-modal-open')
        await waitUntil(() => document.activeElement === trigger)

        expect(document.activeElement).toBe(trigger)
      })

      it('returns focus to the trigger even when the vendor focused into the dialog first (R7)', async () => {
        // CookieYes inserts its markup when the banner loads, long before the
        // preference centre is opened, so it is already there when this
        // service starts watching.
        const modal = addToPage(fadingPreferenceCentre)
        createService()
        trigger.focus()
        // CookieYes moves focus in from an animation frame it requests before
        // the class change is observed, so it runs ahead of this service.
        const save = document.getElementById('cky-fade-save') as HTMLElement
        const focusWhenVisible = () =>
          getComputedStyle(save).visibility === 'visible'
            ? save.focus()
            : requestAnimationFrame(focusWhenVisible)
        requestAnimationFrame(focusWhenVisible)
        modal.classList.add('cky-modal-open')
        await waitUntil(
          () => focusInsideDialog() && announcer.liveAnnounce.calls.count() > 0
        )

        modal.classList.remove('cky-modal-open')
        await waitUntil(() => document.activeElement === trigger)

        expect(document.activeElement).toBe(trigger)
      })

      it('leaves focus where the user put it when the open dialog changes (R7)', async () => {
        await openFading()
        const save = document.getElementById('cky-fade-save') as HTMLElement
        save.focus()

        document
          .getElementById('cky-fade-accordion')
          .classList.add('cky-accordion-active')
        await wait(100)

        expect(document.activeElement).toBe(save)
        expect(announcer.liveAnnounce).toHaveBeenCalledTimes(1)
      })
    })

    it('leaves a OneTrust dialog alone', async () => {
      createService()
      addToPage(oneTrustPreferenceCentre)
      await settle()

      expect(document.activeElement).toBe(trigger)
      expect(announcer.liveAnnounce).not.toHaveBeenCalled()
    })
  })

  describe('while OneTrust is the vendor', () => {
    beforeEach(() => (vendor = 'onetrust'))

    it('still manages the OneTrust preference centre', async () => {
      createService()
      addToPage(oneTrustPreferenceCentre)
      await settle()

      expect(document.activeElement?.id).toBe('ot-save')
      expect((document.getElementById('ot-save') as HTMLElement).tabIndex).toBe(
        0
      )
    })

    it('makes a dialog with no controls focusable itself', async () => {
      createService()
      addToPage(
        '<div id="onetrust-pc-sdk"><div id="ot-empty" role="dialog">Loading</div></div>'
      )
      await settle()

      expect(document.activeElement?.id).toBe('ot-empty')
      expect(
        document.getElementById('ot-empty')?.getAttribute('tabindex')
      ).toBe('-1')
    })

    it('leaves a CookieYes dialog alone', async () => {
      createService()
      addToPage(cookieYesPreferenceCentre)
      await settle()

      expect(document.activeElement).toBe(trigger)
    })
  })
})
