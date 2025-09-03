import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core'
import { of, Subject, NEVER, throwError } from 'rxjs'

import { WINDOW } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { LoginMainInterstitialsManagerService } from 'src/app/core/login-interstitials-manager/login-main-interstitials-manager.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { OauthURLSessionManagerService } from 'src/app/core/oauth-urlsession-manager/oauth-urlsession-manager.service'

import { AuthorizeComponent } from './authorize.component'

// Dummy interstitial component used for typing purposes in tests
@Component({ template: '', standalone: true })
class DummyInterstitialComponent {
  finish = new Subject<void>()
}

describe('AuthorizeComponent', () => {
  let component: AuthorizeComponent
  let fixture: ComponentFixture<AuthorizeComponent>

  let userServiceSpy: jasmine.SpyObj<UserService>
  let platformInfoServiceSpy: jasmine.SpyObj<PlatformInfoService>
  let recordServiceSpy: jasmine.SpyObj<RecordService>
  let loginInterstitialsSpy: jasmine.SpyObj<LoginMainInterstitialsManagerService>
  let togglzSpy: jasmine.SpyObj<TogglzService>
  let oauthUrlSessionSpy: jasmine.SpyObj<OauthURLSessionManagerService>
  let windowMock: any

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserSession'])
    platformInfoServiceSpy = jasmine.createSpyObj('PlatformInfoService', ['get'])
    recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord'])
    loginInterstitialsSpy = jasmine.createSpyObj(
      'LoginMainInterstitialsManagerService',
      ['isUserFullyLoaded', 'checkLoginInterstitials']
    )
    togglzSpy = jasmine.createSpyObj('TogglzService', ['getStateOf'])
    oauthUrlSessionSpy = jasmine.createSpyObj('OauthURLSessionManagerService', ['clear'])

    windowMock = {
      outOfRouterNavigation: jasmine.createSpy('outOfRouterNavigation'),
    }

    ;(globalThis as any).runtimeEnvironment = { debugger: false }

    // Default spy returns; overridden in tests when needed
    platformInfoServiceSpy.get.and.returnValue(of({} as any))
    togglzSpy.getStateOf.and.callFake((flag: string) => {
      // default both flags to false unless a test overrides
      return of(false)
    })
    userServiceSpy.getUserSession.and.returnValue(
      of({ loggedIn: false, oauthSession: null } as any)
    )

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, DummyInterstitialComponent],
      declarations: [AuthorizeComponent],
      providers: [
        { provide: WINDOW, useValue: windowMock },
        { provide: UserService, useValue: userServiceSpy },
        { provide: PlatformInfoService, useValue: platformInfoServiceSpy },
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: LoginMainInterstitialsManagerService, useValue: loginInterstitialsSpy },
        { provide: TogglzService, useValue: togglzSpy },
        { provide: OauthURLSessionManagerService, useValue: oauthUrlSessionSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  function createComponent() {
    fixture = TestBed.createComponent(AuthorizeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  it('should create', () => {
    createComponent()
    expect(component).toBeTruthy()
  })

  it('ngOnInit: sets OAUTH2_AUTHORIZATION_ENABLE from OAUTH_AUTHORIZATION flag', () => {
    togglzSpy.getStateOf.and.callFake((flag: string) => of(flag === 'OAUTH_AUTHORIZATION'))
    createComponent()
    expect((component as any).OAUTH2_AUTHORIZATION_ENABLE).toBeTrue()
  })

  it('ngOnInit: logged out, no oauth session -> shows authorization component', () => {
    userServiceSpy.getUserSession.and.returnValue(
      of({ loggedIn: false, oauthSession: null } as any)
    )
    createComponent()
    expect(component.showAuthorizationComponent).toBeTrue()
    expect(component.loading).toBeFalse()
  })

  it('ngOnInit: logged out with oauth error -> shows error', () => {
    userServiceSpy.getUserSession.and.returnValue(
      of({ loggedIn: false, oauthSession: { error: 'bad' } } as any)
    )
    createComponent()
    expect(component.showAuthorizationError).toBeTrue()
    expect(component.loading).toBeFalse()
  })

  it('ngOnInit: logged in -> loads record and checks interstitials', () => {
    userServiceSpy.getUserSession.and.returnValue(
      of({ loggedIn: true, oauthSession: { redirectUrl: '/r', responseType: 'code' } } as any)
    )
    recordServiceSpy.getRecord.and.returnValue(of({} as any))
    loginInterstitialsSpy.isUserFullyLoaded.and.returnValue(true)
    loginInterstitialsSpy.checkLoginInterstitials.and.returnValue(
      of(DummyInterstitialComponent as any)
    )

    createComponent()

    expect(loginInterstitialsSpy.isUserFullyLoaded).toHaveBeenCalled()
    expect(loginInterstitialsSpy.checkLoginInterstitials).toHaveBeenCalled()
    expect((component as any).interstitialComponent).toBe(
      DummyInterstitialComponent as any
    )
  })

  it('ngOnInit: record load error still finalizes and handles session', () => {
    userServiceSpy.getUserSession.and.returnValue(
      of({ loggedIn: true, oauthSession: null } as any)
    )
    recordServiceSpy.getRecord.and.returnValue(throwError(() => new Error('boom')))
    loginInterstitialsSpy.isUserFullyLoaded.and.returnValue(true)

    createComponent()

    expect(component.showAuthorizationComponent).toBeTrue()
    expect(component.loading).toBeFalse()
  })

  it('handleOauthSession: already authorized without interstitial -> redirects', fakeAsync(() => {
    createComponent()

    togglzSpy.getStateOf.and.callFake((flag: string) => {
      if (flag === 'OAUTH2_AUTHORIZATION') return of(true)
      if (flag === 'OAUTH_AUTHORIZATION') return of(true)
      return of(false)
    })

    const session = {
      loggedIn: false,
      oauthSession: { redirectUrl: '/go?code=123', responseType: 'code' },
    } as any

    ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = false
    ;(component as any).handleOauthSession(session)
    tick()

    expect(oauthUrlSessionSpy.clear).toHaveBeenCalledTimes(1) // because flag true in finishRedirect
    expect(windowMock.outOfRouterNavigation).toHaveBeenCalledWith('/go?code=123')
  }))

  it('handleOauthSession (oauth2): already authorized without interstitial -> redirects and clears', fakeAsync(() => {
    createComponent()

    ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = true
    togglzSpy.getStateOf.and.callFake((flag: string) => of(flag === 'OAUTH2_AUTHORIZATION'))

    const session = { loggedIn: false, oauthSession: { redirectUrl: '/ok' } } as any

    ;(component as any).handleOauthSession(session)
    tick()

    expect(oauthUrlSessionSpy.clear).toHaveBeenCalledTimes(1)
    expect(windowMock.outOfRouterNavigation).toHaveBeenCalledWith('/ok')
  }))

  it('handleOauthSession: already authorized WITH interstitial -> schedules interstitial', fakeAsync(() => {
    createComponent()

    // Prepare interstitial present and spy on showInterstitial
    ;(component as any).interstitialComponent = DummyInterstitialComponent as any
    spyOn<any>(component as any, 'showInterstitial').and.callFake(() => {})

    const session = {
      loggedIn: false,
      oauthSession: { redirectUrl: '/here?code=1', responseType: 'code' },
    } as any

    ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = false
    ;(component as any).handleOauthSession(session)

    // setTimeout is used inside handleOauthSession
    tick()

    expect((component as any).redirectByReportAlreadyAuthorize).toBeTrue()
    expect((component as any).redirectUrl).toBe('/here?code=1')
    expect((component as any).showInterstitial).toHaveBeenCalled()
  }))

  it('handleOauthSession (oauth2): already authorized WITH interstitial -> schedules interstitial', fakeAsync(() => {
    createComponent()

    ;(component as any).interstitialComponent = DummyInterstitialComponent as any
    spyOn<any>(component as any, 'showInterstitial').and.callFake(() => {})

    const session = { loggedIn: false, oauthSession: { redirectUrl: '/ok2' } } as any

    ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = true
    ;(component as any).handleOauthSession(session)
    tick()

    expect((component as any).redirectByReportAlreadyAuthorize).toBeTrue()
    expect((component as any).redirectUrl).toBe('/ok2')
    expect((component as any).showInterstitial).toHaveBeenCalled()
  }))

  it('handleOauthSession: not authorized -> shows authorization component', () => {
    createComponent()

    const session = { loggedIn: false, oauthSession: null } as any
    ;(component as any).handleOauthSession(session)

    expect(component.showAuthorizationComponent).toBeTrue()
    expect(component.loading).toBeFalse()
  })

  it('handleOauthSession: not authorized but interstitial present -> shows authorization and does not show interstitial (legacy)', () => {
    createComponent()

    ;(component as any).interstitialComponent = DummyInterstitialComponent as any
    spyOn<any>(component as any, 'showInterstitial')

    ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = false
    const session = { loggedIn: true, oauthSession: { redirectUrl: '/x?state=1', responseType: 'code' } } as any

    ;(component as any).handleOauthSession(session)

    expect(component.showAuthorizationComponent).toBeTrue()
    expect((component as any).showInterstitial).not.toHaveBeenCalled()
  })

  it('handleOauthSession: not authorized but interstitial present -> shows authorization and does not show interstitial (oauth2)', () => {
    createComponent()

    ;(component as any).interstitialComponent = DummyInterstitialComponent as any
    spyOn<any>(component as any, 'showInterstitial')

    ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = true
    const session = { loggedIn: true, oauthSession: {} } as any

    ;(component as any).handleOauthSession(session)

    expect(component.showAuthorizationComponent).toBeTrue()
    expect((component as any).showInterstitial).not.toHaveBeenCalled()
  })

  it('handleRedirect: with interstitial -> finish emission triggers finishRedirect', () => {
    createComponent()
    ;(component as any).interstitialComponent = DummyInterstitialComponent as any

    const finish$ = new Subject<void>()
    ;(component as any).outlet = {
      attachComponentPortal: () => ({
        instance: { finish: finish$.asObservable() },
        changeDetectorRef: { detectChanges: () => {} },
      }),
    }

    const finishSpy = spyOn<any>(component as any, 'finishRedirect').and.returnValue(of(true))

    component.handleRedirect('/x')
    expect(component.showInterstital).toBeTrue()

    finish$.next()

    expect(finishSpy).toHaveBeenCalled()
  })

  it('handleRedirect: with interstitial -> shows interstitial instead of redirect', () => {
    createComponent()
    ;(component as any).interstitialComponent = DummyInterstitialComponent as any

    // mock outlet to avoid CDK dependency
    const finish$ = new Subject<void>()
    ;(component as any).outlet = {
      attachComponentPortal: () => ({
        instance: { finish: finish$.asObservable() },
        changeDetectorRef: { detectChanges: () => {} },
      }),
    }

    spyOn<any>(component as any, 'finishRedirect').and.returnValue(NEVER)

    component.handleRedirect('/x')

    expect(component.showInterstital).toBeTrue()
    expect(component.showAuthorizationComponent).toBeFalse()
  })

  it('handleRedirect: without interstitial -> calls finishRedirect', () => {
    createComponent()

    const finishSpy = spyOn<any>(component as any, 'finishRedirect').and.returnValue(of(true))

    component.handleRedirect('/final')

    expect(finishSpy).toHaveBeenCalled()
  })

  it('handleRedirect: empty URL still calls finishRedirect', () => {
    createComponent()
    const finishSpy = spyOn<any>(component as any, 'finishRedirect').and.returnValue(of(true))

    component.handleRedirect('' as any)

    expect(finishSpy).toHaveBeenCalled()
  })

  it('finishRedirect: togglz true -> clears session and navigates', fakeAsync(() => {
    createComponent()
    ;(component as any).redirectUrl = '/final'

    togglzSpy.getStateOf.and.callFake((flag: string) => {
      if (flag === 'OAUTH2_AUTHORIZATION') return of(true)
      return of(false)
    })

    ;(component as any).finishRedirect().subscribe()
    tick()

    expect(oauthUrlSessionSpy.clear).toHaveBeenCalled()
    expect(windowMock.outOfRouterNavigation).toHaveBeenCalledWith('/final')
  }))

  it('finishRedirect: togglz false -> navigates without clearing', fakeAsync(() => {
    createComponent()
    ;(component as any).redirectUrl = '/final'

    togglzSpy.getStateOf.and.returnValue(of(false))

    ;(component as any).finishRedirect().subscribe()
    tick()

    expect(oauthUrlSessionSpy.clear).not.toHaveBeenCalled()
    expect(windowMock.outOfRouterNavigation).toHaveBeenCalledWith('/final')
  }))

  it('finishRedirect: undefined redirectUrl still calls navigation', fakeAsync(() => {
    createComponent()
    ;(component as any).redirectUrl = undefined as any

    togglzSpy.getStateOf.and.returnValue(of(false))

    ;(component as any).finishRedirect().subscribe()
    tick()

    expect(windowMock.outOfRouterNavigation).toHaveBeenCalledWith(undefined)
  }))

  describe('isUserAlreadyAuthorized', () => {
    it('legacy oauth: true when redirectUrl contains responseType param', () => {
      createComponent()
      ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = false
      const session = { redirectUrl: 'https://a?code=123', responseType: 'code' }
      const result = (component as any).isUserAlreadyAuthorized(session)
      expect(result).toBeTrue()
    })

    it('legacy oauth: false when redirectUrl does not have responseType', () => {
      createComponent()
      ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = false
      const session = { redirectUrl: 'https://a?state=1', responseType: 'code' }
      const result = (component as any).isUserAlreadyAuthorized(session)
      expect(result).toBeFalse()
    })

    it('oauth2: true when redirectUrl present', () => {
      createComponent()
      ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = true
      const session = { redirectUrl: 'https://b' }
      const result = (component as any).isUserAlreadyAuthorized(session)
      expect(result).toBeTrue()
    })

    it('oauth2: false when redirectUrl missing', () => {
      createComponent()
      ;(component as any).OAUTH2_AUTHORIZATION_ENABLE = true
      const session = {}
      const result = (component as any).isUserAlreadyAuthorized(session)
      expect(result).toBeFalse()
    })
  })
})
