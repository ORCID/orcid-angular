import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { HttpResponse } from '@angular/common/http'

import { FormAuthorizeComponent } from './form-authorize.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { OauthService } from '../../../core/oauth/oauth.service'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { Title } from '@angular/platform-browser'
import { OauthURLSessionManagerService } from '../../../core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { TrustedIndividualsService } from '../../../core/trusted-individuals/trusted-individuals.service'
import { PlatformInfo } from '../../../cdk/platform-info/platform-info.type'
import { UserSession } from '../../../types/session.local'
import { UserInfo } from '../../../types'
import { NameForm } from '../../../types'
import { ThirdPartyAuthData } from '../../../types/sign-in-data.endpoint'
import { LegacyOauthRequestInfoForm } from '../../../types/request-info-form.endpoint'
import { WINDOW } from '../../../cdk/window'
import { TrustedIndividuals } from '../../../types/trusted-individuals.endpoint'
import { BehaviorSubject } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormAuthorizeComponent', () => {
  let component: FormAuthorizeComponent
  let fixture: ComponentFixture<FormAuthorizeComponent>
  let userService: jasmine.SpyObj<UserService>
  let togglzService: jasmine.SpyObj<TogglzService>
  let platformInfoService: jasmine.SpyObj<PlatformInfoService>
  let mockWindow: jasmine.SpyObj<Window>

  beforeEach(waitForAsync(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'noRedirectLogout',
      'getUserSession',
    ])
    const togglzServiceSpy = jasmine.createSpyObj('TogglzService', [
      'getStateOf',
    ])
    const platformInfoServiceSpy = jasmine.createSpyObj('PlatformInfoService', [
      'get',
    ])
    const trustedIndividualsServiceSpy = jasmine.createSpyObj(
      'TrustedIndividualsService',
      ['getTrustedIndividuals']
    )
    const oauthServiceSpy = jasmine.createSpyObj('OauthService', [
      'authorize',
      'authorizeOnAuthServer',
    ])
    const snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
      'showError',
      'showSuccess',
    ])
    const errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ])
    const oauthURLSessionManagerServiceSpy = jasmine.createSpyObj(
      'OauthURLSessionManagerService',
      ['getOauthUrlSession']
    )
    const mockWindowSpy = jasmine.createSpyObj('Window', ['location'])

    // Setup window.location mock
    Object.defineProperty(mockWindowSpy, 'location', {
      value: {
        href: '',
      },
      writable: true,
    })

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FormAuthorizeComponent],
      providers: [
        WINDOW_PROVIDERS,
        { provide: UserService, useValue: userServiceSpy },
        { provide: TogglzService, useValue: togglzServiceSpy },
        { provide: PlatformInfoService, useValue: platformInfoServiceSpy },
        {
          provide: TrustedIndividualsService,
          useValue: trustedIndividualsServiceSpy,
        },
        { provide: OauthService, useValue: oauthServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        {
          provide: OauthURLSessionManagerService,
          useValue: oauthURLSessionManagerServiceSpy,
        },
        { provide: WINDOW, useValue: mockWindowSpy },
        MatSnackBar,
        MatDialog,
        Overlay,
        Title,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAuthorizeComponent)
    component = fixture.componentInstance

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>
    togglzService = TestBed.inject(
      TogglzService
    ) as jasmine.SpyObj<TogglzService>
    platformInfoService = TestBed.inject(
      PlatformInfoService
    ) as jasmine.SpyObj<PlatformInfoService>
    mockWindow = TestBed.inject(WINDOW) as jasmine.SpyObj<Window>

    // Setup default mocks
    togglzService.getStateOf.and.returnValue(of(false))
    platformInfoService.get.and.returnValue(
      of({
        rtl: false,
        ltr: true,
        screenDirection: 'ltr' as const,
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
        columns12: false,
        hasOauthParameters: false,
        social: false,
        institutional: false,
        queryParameters: {},
        currentRoute: '',
        reactivation: false,
        reactivationCode: '',
        summaryScreen: false,
      } as PlatformInfo)
    )

    const mockUserInfo: UserInfo = {
      EFFECTIVE_USER_ORCID: '0000-0000-0000-0000',
      PRIMARY_EMAIL: 'test@example.com',
      IS_DEACTIVATED: 'false',
      IS_LOCKED: 'false',
      DEVELOPER_TOOLS_ENABLED: 'false',
      IS_PRIMARY_EMAIL_VERIFIED: 'true',
      LOCKED: 'false',
      CLAIMED: 'true',
      HAS_VERIFIED_EMAIL: 'true',
      REAL_USER_ORCID: '0000-0000-0000-0000',
      IN_DELEGATION_MODE: 'false',
      LAST_MODIFIED: '2023-01-01T00:00:00.000Z',
      RECORD_WITH_ISSUES: false,
      USER_NOT_FOUND: false,
      DELEGATED_BY_ADMIN: undefined,
      READY_FOR_INDEXING: 'true',
    }

    const mockOauthSession = {
      scopes: [],
      clientName: 'Test Client',
      redirectUri: 'https://test.com/callback',
    } as unknown as LegacyOauthRequestInfoForm

    userService.getUserSession.and.returnValue(
      of({
        userInfo: mockUserInfo,
        nameForm: {} as NameForm,
        oauthSession: mockOauthSession,
        oauthSessionIsLoggedIn: true,
        displayName: 'Test User',
        orcidUrl: 'https://orcid.org/0000-0000-0000-0000',
        effectiveOrcidUrl: 'https://orcid.org/0000-0000-0000-0000',
        loggedIn: true,
        thirdPartyAuthData: {} as ThirdPartyAuthData,
      } as UserSession)
    )

    const trustedIndividualsService = TestBed.inject(
      TrustedIndividualsService
    ) as jasmine.SpyObj<TrustedIndividualsService>
    trustedIndividualsService.getTrustedIndividuals.and.returnValue(
      of({
        delegators: [],
      } as TrustedIndividuals)
    )

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('logout', () => {
    beforeEach(() => {
      component.OAUTH_AUTHORIZATION = true
      component.platformInfo = {
        rtl: false,
        ltr: true,
        screenDirection: 'ltr' as const,
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
        columns12: false,
        hasOauthParameters: false,
        social: false,
        institutional: false,
        queryParameters: {},
        currentRoute: '',
        reactivation: false,
        reactivationCode: '',
        summaryScreen: false,
      } as PlatformInfo
    })

    it('should redirect to signin with query parameters on successful logout', () => {
      const queryParams = {
        email: 'test@example.com',
        scope: 'read write',
        state: 'test-state',
      }
      component.platformInfo.queryParameters = queryParams
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(userService.noRedirectLogout).toHaveBeenCalled()
      expect(mockWindow.location.href).toBe(
        '/signin?email=test%40example.com&scope=read+write&state=test-state'
      )
    })

    it('should handle special characters in email query parameter', () => {
      const queryParams = {
        email: 'test+special@example.com',
        scope: 'read write',
        state: 'test-state',
      }
      component.platformInfo.queryParameters = queryParams
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(mockWindow.location.href).toBe(
        '/signin?email=test%2Bspecial%40example.com&scope=read+write&state=test-state'
      )
    })

    it('should handle email with unicode characters', () => {
      const queryParams = {
        email: 'tëst@éxämplé.com',
        scope: 'read write',
        state: 'test-state',
      }
      component.platformInfo.queryParameters = queryParams
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(mockWindow.location.href).toBe(
        '/signin?email=t%C3%ABst%40%C3%A9x%C3%A4mpl%C3%A9.com&scope=read+write&state=test-state'
      )
    })

    it('should handle spaces in scope parameter correctly', () => {
      const queryParams = {
        email: 'test@example.com',
        scope: 'read write update',
        state: 'test-state',
      }
      component.platformInfo.queryParameters = queryParams
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(mockWindow.location.href).toBe(
        '/signin?email=test%40example.com&scope=read+write+update&state=test-state'
      )
    })

    it('should handle complex query parameters with special characters', () => {
      const queryParams = {
        email: 'user+tag@sub.domain.com',
        scope: 'read write update',
        state: 'test-state-123',
        redirect_uri: 'https://app.example.com/callback?param=value&other=test',
      }
      component.platformInfo.queryParameters = queryParams
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(mockWindow.location.href).toContain(
        'email=user%2Btag%40sub.domain.com'
      )
      expect(mockWindow.location.href).toContain('scope=read+write+update')
      expect(mockWindow.location.href).toContain('state=test-state-123')
      expect(mockWindow.location.href).toContain('redirect_uri=')
    })

    it('should redirect to signin even when noRedirectLogout fails', (done) => {
      const queryParams = {
        email: 'test@example.com',
        scope: 'read write',
      }
      component.platformInfo.queryParameters = queryParams
      userService.noRedirectLogout.and.returnValue(
        throwError(() => new Error('Logout failed'))
      )

      component.logout()

      // Wait for the async operation to complete
      setTimeout(() => {
        expect(userService.noRedirectLogout).toHaveBeenCalled()
        expect(mockWindow.location.href).toBe(
          '/signin?email=test%40example.com&scope=read+write'
        )
        done()
      }, 100)
    })

    it('should redirect to signin with empty query parameters when noRedirectLogout fails', (done) => {
      component.platformInfo.queryParameters = {}
      userService.noRedirectLogout.and.returnValue(
        throwError(() => new Error('Logout failed'))
      )

      component.logout()

      // Wait for the async operation to complete
      setTimeout(() => {
        expect(mockWindow.location.href).toBe('/signin')
        done()
      }, 100)
    })

    it('should redirect to signout when OAUTH_AUTHORIZATION is false', () => {
      component.OAUTH_AUTHORIZATION = false

      component.logout()

      expect(mockWindow.location.href).toBe('/signout')
      expect(userService.noRedirectLogout).not.toHaveBeenCalled()
    })

    it('should handle null query parameters gracefully', () => {
      component.platformInfo.queryParameters = null
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(mockWindow.location.href).toBe('/signin')
    })

    it('should handle undefined query parameters gracefully', () => {
      component.platformInfo.queryParameters = undefined
      userService.noRedirectLogout.and.returnValue(
        of(new HttpResponse({ body: 'OK' }))
      )

      component.logout()

      expect(mockWindow.location.href).toBe('/signin')
    })
  })
})
