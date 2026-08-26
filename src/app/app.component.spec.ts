import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from './cdk/window'
import { PlatformInfo, PlatformInfoService } from './cdk/platform-info'
import { ErrorHandlerService } from './core/error-handler/error-handler.service'
import { SnackbarService } from './cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { TitleService } from './core/title-service/title.service'
import { ZendeskService } from './core/zendesk/zendesk.service'
import { BehaviorSubject, of } from 'rxjs'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

/**
 * Mirrors the defaults PlatformInfoService starts with, including the empty
 * `currentRoute` it holds until the first NavigationEnd.
 */
const BASE_PLATFORM_INFO: PlatformInfo = {
  rtl: false,
  ltr: true,
  screenDirection: 'ltr',
  unsupportedBrowser: false,
  desktop: true,
  tabletOrHandset: false,
  tablet: false,
  handset: false,
  edge: false,
  ie: false,
  safary: false,
  firefox: false,
  columns4: false,
  columns8: false,
  columns12: true,
  hasOauthParameters: false,
  social: false,
  institutional: false,
  queryParameters: {},
  currentRoute: '',
  reactivation: false,
  reactivationCode: '',
  summaryScreen: false,
}

describe('AppComponent', () => {
  let platformInfo$: BehaviorSubject<PlatformInfo>
  let zendesk: jasmine.SpyObj<ZendeskService>

  /** Push a new platform state, the way PlatformInfoService's subject does. */
  function emit(overrides: Partial<PlatformInfo>) {
    platformInfo$.next({ ...BASE_PLATFORM_INFO, ...overrides })
  }

  function createApp() {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    return fixture
  }

  beforeEach(() => {
    platformInfo$ = new BehaviorSubject<PlatformInfo>({ ...BASE_PLATFORM_INFO })
    zendesk = jasmine.createSpyObj<ZendeskService>('ZendeskService', [
      'show',
      'hide',
      'open',
      'adaptPluginToPlatform',
      'autofillTicketForm',
    ])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        WINDOW_PROVIDERS,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        {
          provide: PlatformInfoService,
          useValue: { get: () => platformInfo$.asObservable() },
        },
        { provide: ZendeskService, useValue: zendesk },
        {
          provide: TitleService,
          useValue: {
            init: () => of({}),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  })

  describe('Zendesk help widget', () => {
    it('hides the widget before the router resolves the first route', () => {
      createApp()
      expect(zendesk.hide).toHaveBeenCalledTimes(1)
      expect(zendesk.show).not.toHaveBeenCalled()
    })

    // PD-5715 acceptance criteria
    it('never shows the widget on the homepage', () => {
      createApp()
      emit({ currentRoute: '/' })
      emit({ currentRoute: '/?utm_source=newsletter' })
      expect(zendesk.show).not.toHaveBeenCalled()
      expect(zendesk.hide).toHaveBeenCalledTimes(1)
    })

    // PD-5715 acceptance criteria, and the regression guard for 1892786e5:
    // an unconditional _zendesk.hide() in the platformInfo subscription fails
    // this test.
    it('shows the widget on a registry page that is not the homepage', () => {
      createApp()
      emit({ currentRoute: '/my-orcid' })
      expect(zendesk.show).toHaveBeenCalledTimes(1)
    })

    it('shows the widget on the 404 page, whose copy points at it', () => {
      createApp()
      emit({ currentRoute: '/this-route-does-not-exist' })
      expect(zendesk.show).toHaveBeenCalledTimes(1)
    })

    it('hides the widget again when navigating back to the homepage', () => {
      createApp()
      emit({ currentRoute: '/my-orcid' })
      zendesk.hide.calls.reset()
      emit({ currentRoute: '/' })
      expect(zendesk.hide).toHaveBeenCalledTimes(1)
    })

    it('does not show the widget while oauth parameters are present', () => {
      createApp()
      emit({
        currentRoute: '/oauth/authorize',
        hasOauthParameters: true,
        queryParameters: { client_id: 'APP-0000' },
      })
      expect(zendesk.show).not.toHaveBeenCalled()
    })

    it('does not show the widget on trusted summary routes', () => {
      createApp()
      emit({ currentRoute: '/0000-0002-1825-0097/summary' })
      expect(zendesk.show).not.toHaveBeenCalled()
    })

    it('acts on visibility transitions only, not on every platform emission', () => {
      createApp()
      emit({ currentRoute: '/my-orcid' })
      emit({ currentRoute: '/my-orcid', handset: true }) // breakpoint change
      emit({ currentRoute: '/my-orcid/works' })
      expect(zendesk.show).toHaveBeenCalledTimes(1)
    })

    it('applies the RTL widget position when it shows the widget', () => {
      createApp()
      emit({
        currentRoute: '/my-orcid',
        rtl: true,
        ltr: false,
        screenDirection: 'rtl',
      })
      expect(zendesk.adaptPluginToPlatform).toHaveBeenCalledWith(
        jasmine.objectContaining({ screenDirection: 'rtl' })
      )
    })
  })
})
