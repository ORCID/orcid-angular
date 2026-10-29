import { TestBed } from '@angular/core/testing'
import { GoogleTagManagerService } from './google-tag-manager.service'
import { ItemGTM } from '../../types/item_gtm'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { HttpClientTestingModule } from '@angular/common/http/testing'

// The service loads gtm.js from www.googletagmanager.com. These specs never let
// it: the script element is intercepted before it reaches the document, and its
// load or error event is simulated. A real gtm.js running inside the karma page
// pushes its own dataLayer events and can stall the browser past karma's 30s
// no-activity limit, which disconnected the whole suite.
describe('GoogleTagManagerService', () => {
  const tag: ItemGTM = { event: 'page' }
  let service: GoogleTagManagerService
  let inserted: HTMLScriptElement[]

  function simulateScript(outcome: 'load' | 'error', onLoad?: () => void) {
    spyOn(document.head, 'insertBefore').and.callFake(
      <T extends Node>(node: T): T => {
        const script = node as unknown as HTMLScriptElement
        inserted.push(script)
        setTimeout(() => {
          if (outcome === 'load' && onLoad) {
            onLoad()
          }
          script.dispatchEvent(new Event(outcome))
        })
        return node
      }
    )
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        GoogleTagManagerService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    ;(window as any).dataLayer = []
    inserted = []
    service = TestBed.inject(GoogleTagManagerService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('adds the GTM script element and reports when it loads', (done) => {
    simulateScript('load')
    service.addGtmToDom().subscribe({
      next: (loaded) => {
        expect(loaded).toBeTrue()
        expect(inserted.length).toBe(1)
        expect(inserted[0].id).toBe('GTM')
        expect(inserted[0].getAttribute('src')).toContain(
          'https://www.googletagmanager.com/gtm.js?id='
        )
        done()
      },
      error: done.fail,
    })
  })

  it('reports an error when the GTM script cannot be loaded', (done) => {
    simulateScript('error')
    service.addGtmToDom().subscribe({
      next: () => done.fail('expected an error'),
      error: (error) => {
        expect(error).toEqual(
          jasmine.objectContaining({
            name: 'GTM - Error',
            message: 'Unable to add GTM',
          })
        )
        done()
      },
    })
  })

  it('pushes tags in the dataLayer once GTM is running', (done) => {
    // A running GTM stamps the events it processes with gtm.uniqueEventId.
    simulateScript('load', () =>
      (window as any).dataLayer.push({ 'gtm.uniqueEventId': 1 })
    )
    service.pushTag(tag).subscribe({
      next: () => {
        const dataLayer = (window as any).dataLayer
        expect(dataLayer[dataLayer.length - 1]).toEqual(tag)
        done()
      },
      error: done.fail,
    })
  })

  it('reports an error when GTM loads but does not process events', (done) => {
    // What an ad blocker that stubs gtm.js looks like: the script loads, but
    // nothing ever gets a gtm.uniqueEventId.
    simulateScript('load')
    service.pushTag(tag).subscribe({
      next: () => done.fail('expected an error'),
      error: (error) => {
        expect((window as any).dataLayer).toContain(tag)
        expect(error).toEqual(
          jasmine.objectContaining({
            name: 'GTM - Error',
            message: 'Gtm is not adding uniqueEventId attributes',
          })
        )
        done()
      },
    })
  })
})
