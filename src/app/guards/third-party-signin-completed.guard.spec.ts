import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { of } from 'rxjs'

import { ThirdPartySigninCompletedGuard } from './third-party-signin-completed.guard'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS, WINDOW } from '../cdk/window'
import { PlatformInfoService } from '../cdk/platform-info'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { SnackbarService } from '../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../core'
import { OauthURLSessionManagerService } from '../core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { TogglzService } from '../core/togglz/togglz.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ThirdPartySigninCompletedGuard', () => {
  let guard: ThirdPartySigninCompletedGuard
  let userService: jasmine.SpyObj<UserService>
  let oauthUrlSessionManager: jasmine.SpyObj<OauthURLSessionManagerService>
  let router: jasmine.SpyObj<Router>
  let mockWindow: any
  let togglzService: jasmine.SpyObj<TogglzService>

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserSession'])
    const oauthUrlSessionManagerSpy = jasmine.createSpyObj('OauthURLSessionManagerService', ['get', 'clear'])
    const routerSpy = jasmine.createSpyObj('Router', ['parseUrl'])
    const togglzSpy = jasmine.createSpyObj('TogglzService', ['getStateOf'])

    mockWindow = {
      outOfRouterNavigation: jasmine.createSpy('outOfRouterNavigation')
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        { provide: UserService, useValue: userServiceSpy },
        { provide: OauthURLSessionManagerService, useValue: oauthUrlSessionManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TogglzService, useValue: togglzSpy },
        { provide: WINDOW, useValue: mockWindow },
      ],
    })
    
    guard = TestBed.inject(ThirdPartySigninCompletedGuard)
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>
    oauthUrlSessionManager = TestBed.inject(OauthURLSessionManagerService) as jasmine.SpyObj<OauthURLSessionManagerService>
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>
    togglzService = TestBed.inject(TogglzService) as jasmine.SpyObj<TogglzService>
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  describe('canActivateChild', () => {
    const mockRoute = {} as any
    const mockState = { url: '/basepath/third-party-signin-completed' } as any

    beforeEach(() => {
      userService.getUserSession.and.returnValue(of({} as any))
    })

    it('should redirect to OAuth URL when one is stored and OAUTH_AUTHORIZATION is true', (done) => {
      togglzService.getStateOf.and.returnValue(of(true))
      const oauthUrl = 'https://example.com/oauth/callback?code=123'
      oauthUrlSessionManager.get.and.returnValue(oauthUrl)
      oauthUrlSessionManager.clear.and.returnValue()

      const result$ = guard.canActivateChild(mockRoute, mockState) as any
      result$.subscribe(result => {
        expect(oauthUrlSessionManager.get).toHaveBeenCalled()
        expect(oauthUrlSessionManager.clear).toHaveBeenCalled()
        expect(mockWindow.outOfRouterNavigation).toHaveBeenCalledWith(oauthUrl)
        expect(result).toBe(false)
        expect(router.parseUrl).not.toHaveBeenCalled()
        done()
      })
    })

    it('should proceed with normal navigation when no OAuth URL is stored and OAUTH_AUTHORIZATION is true', (done) => {
      togglzService.getStateOf.and.returnValue(of(true))
      oauthUrlSessionManager.get.and.returnValue(null)
      const expectedUrl = '/basepath'
      const mockUrlTree = { url: expectedUrl } as any
      router.parseUrl.and.returnValue(mockUrlTree)

      const result$ = guard.canActivateChild(mockRoute, mockState) as any
      result$.subscribe(result => {
        expect(oauthUrlSessionManager.get).toHaveBeenCalled()
        expect(oauthUrlSessionManager.clear).not.toHaveBeenCalled()
        expect(mockWindow.outOfRouterNavigation).not.toHaveBeenCalled()
        expect(router.parseUrl).toHaveBeenCalledWith(expectedUrl)
        expect(result).toBe(mockUrlTree)
        done()
      })
    })

    it('should proceed with normal navigation when OAuth URL is empty string and OAUTH_AUTHORIZATION is true', (done) => {
      togglzService.getStateOf.and.returnValue(of(true))
      oauthUrlSessionManager.get.and.returnValue('')
      const expectedUrl = '/basepath'
      const mockUrlTree = { url: expectedUrl } as any
      router.parseUrl.and.returnValue(mockUrlTree)

      const result$ = guard.canActivateChild(mockRoute, mockState) as any
      result$.subscribe(result => {
        expect(oauthUrlSessionManager.get).toHaveBeenCalled()
        expect(oauthUrlSessionManager.clear).not.toHaveBeenCalled()
        expect(mockWindow.outOfRouterNavigation).not.toHaveBeenCalled()
        expect(router.parseUrl).toHaveBeenCalledWith(expectedUrl)
        expect(result).toBe(mockUrlTree)
        done()
      })
    })

    it('should not redirect when feature flag is disabled, even if URL exists', (done) => {
      togglzService.getStateOf.and.returnValue(of(false))
      const oauthUrl = 'https://example.com/oauth/callback?code=123'
      oauthUrlSessionManager.get.and.returnValue(oauthUrl)
      const expectedUrl = '/basepath'
      const mockUrlTree = { url: expectedUrl } as any
      router.parseUrl.and.returnValue(mockUrlTree)

      const result$ = guard.canActivateChild(mockRoute, mockState) as any
      result$.subscribe(result => {
        expect(oauthUrlSessionManager.get).not.toHaveBeenCalled()
        expect(oauthUrlSessionManager.clear).not.toHaveBeenCalled()
        expect(mockWindow.outOfRouterNavigation).not.toHaveBeenCalled()
        expect(router.parseUrl).toHaveBeenCalledWith(expectedUrl)
        expect(result).toBe(mockUrlTree)
        done()
      })
    })

    it('should strip /third-party-signin-completed from URL correctly', (done) => {
      togglzService.getStateOf.and.returnValue(of(true))
      oauthUrlSessionManager.get.and.returnValue(null)
      const mockUrlTree = { url: '/basepath' } as any
      router.parseUrl.and.returnValue(mockUrlTree)

      const result$ = guard.canActivateChild(mockRoute, mockState) as any
      result$.subscribe(result => {
        expect(router.parseUrl).toHaveBeenCalledWith('/basepath')
        done()
      })
    })

    it('should handle URL without /third-party-signin-completed suffix', (done) => {
      togglzService.getStateOf.and.returnValue(of(true))
      oauthUrlSessionManager.get.and.returnValue(null)
      const stateWithoutSuffix = { url: '/basepath' } as any
      const mockUrlTree = { url: '/basepath' } as any
      router.parseUrl.and.returnValue(mockUrlTree)

      const result$ = guard.canActivateChild(mockRoute, stateWithoutSuffix) as any
      result$.subscribe(result => {
        expect(router.parseUrl).toHaveBeenCalledWith('/basepath')
        done()
      })
    })
  })
})
