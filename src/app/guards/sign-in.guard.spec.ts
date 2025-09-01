import { TestBed } from '@angular/core/testing'

import { SignInGuard } from './sign-in.guard'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../cdk/window'
import { PlatformInfoService } from '../cdk/platform-info'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { SnackbarService } from '../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of, firstValueFrom } from 'rxjs'
import { UserService } from '../core/user/user.service'
import { TogglzService } from '../core/togglz/togglz.service'

describe('SignInGuard', () => {
  let guard: SignInGuard
  let router: Router
  let userServiceMock: { getUserSession: jasmine.Spy }
  let togglzServiceMock: { getStateOf: jasmine.Spy }

  beforeEach(() => {
    userServiceMock = {
      getUserSession: jasmine.createSpy('getUserSession'),
    }
    togglzServiceMock = {
      getStateOf: jasmine.createSpy('getStateOf'),
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
        { provide: UserService, useValue: userServiceMock },
        { provide: TogglzService, useValue: togglzServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    guard = TestBed.inject(SignInGuard)
    router = TestBed.inject(Router)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  function makeSnapshot(queryParams: any): ActivatedRouteSnapshot {
    return { queryParams } as unknown as ActivatedRouteSnapshot
  }

  async function runGuard(qp: any, session: any, toglz: boolean = false) {
    togglzServiceMock.getStateOf.and.returnValue(of(toglz))
    userServiceMock.getUserSession.and.returnValue(of(session))
    const result = (await firstValueFrom(
      guard.canActivateChild(makeSnapshot(qp), {} as RouterStateSnapshot) as any
    )) as boolean | UrlTree
    return result
  }
  describe('OAUTH_AUTHORIZATION Disabled', () => {
    it('redirects to /register when email present with no userId (User Dont Exists) and not logged in', async () => {
      const qp = { email: 'user@example.org' }
      const session = {
        oauthSession: { userId: undefined, forceLogin: false },
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/register?email=user@example.org'
      )
    })

    it("redirects to /register when show_login === 'false' with no userId (User Dont Exists) and not logged in", async () => {
      const qp = { show_login: 'false' }
      const session = {
        oauthSession: { userId: undefined, forceLogin: false },
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/register?show_login=false'
      )
    })

    it('redirects to /oauth/authorize when oauthSessionIsLoggedIn and not forceLogin', async () => {
      const qp = { client_id: 'abc123' }
      const session = {
        oauthSession: { userId: 'u1', forceLogin: false },
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?client_id=abc123'
      )
    })

    it('allos user go to login (return true) when no matching conditions', async () => {
      const qp = { show_login: 'true' }
      const session = {
        oauthSession: { userId: undefined },
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result).toBeTrue()
    })

    it('returns true when no oauthSession present', async () => {
      const qp = {}
      const session = {
        oauthSession: undefined,
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result).toBeTrue()
    })

    it('returns true when email present but user exists (userId present)', async () => {
      const qp = { email: 'user@example.org' }
      const session = {
        oauthSession: { userId: 'existing-user', forceLogin: false },
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result).toBeTrue()
    })

    it('redirect to /oauth/authorize when email present but oauthSessionIsLoggedIn is true', async () => {
      const qp = { email: 'user@example.org' }
      const session = {
        oauthSession: { userId: undefined, forceLogin: false },
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?email=user@example.org'
      )
    })

    it("returns true when show_login === 'false' but user exists (userId present)", async () => {
      const qp = { show_login: 'false' }
      const session = {
        oauthSession: { userId: 'existing-user', forceLogin: false },
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result).toBeTrue()
    })

    it("redirect to /oauth/authorize when show_login === 'false' and oauthSessionIsLoggedIn is true", async () => {
      const qp = { show_login: 'false' }
      const session = {
        oauthSession: { userId: undefined, forceLogin: false },
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?show_login=false'
      )
    })

    it('returns true when oauthSessionIsLoggedIn is true but forceLogin is true', async () => {
      const qp = { client_id: 'abc123' }
      const session = {
        oauthSession: { userId: 'u1', forceLogin: true },
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session)
      expect(result).toBeTrue()
    })

    it('redirects to /register when orcid present with no userId (User Dont Exists) and not logged in', async () => {
      const qp = { orcid: '0000-0002-1825-0097' }
      const session = {
        oauthSession: { userId: undefined, forceLogin: false },
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/register?orcid=0000-0002-1825-0097'
      )
    })
  })
  describe('OAUTH_AUTHORIZATION Enable', () => {
    it('redirects to /register when email present, forceLogin is true and  and not logged in **', async () => {
      const qp = { email: 'user@example.org', show_login: 'false' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/register?email=user@example.org&show_login=false'
      )
    })

    it('redirects to /oauth/authorize when oauthSessionIsLoggedIn and not forceLogin (prompt !== login) **', async () => {
      const qp = { client_id: 'abc123' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?client_id=abc123'
      )
    })

    it('allow the user go to login (return true) when no matching conditions', async () => {
      const qp = { show_login: 'true' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session, true)
      expect(result).toBeTrue()
    })

    it('returns true when no oauthSession present', async () => {
      const qp = {}
      const session = {
        oauthSession: undefined,
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session, true)
      expect(result).toBeTrue()
    })

    it('returns true when email present but no prompt=login', async () => {
      const qp = { email: 'user@example.org' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session, true)
      expect(result).toBeTrue()
    })

    it('returns true when email present and prompt=login', async () => {
      const qp = { email: 'user@example.org', prompt: 'login' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session, true)
      expect(result).toBeTrue()
    })

    it("redirect to /oauth/authorize when show_login === 'false' and oauthSessionIsLoggedIn is true", async () => {
      const qp = { show_login: 'false' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?show_login=false'
      )
    })
    it("redirect to /register when show_login === 'false' and oauthSessionIsLoggedIn is false", async () => {
      const qp = { show_login: 'false' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/register?show_login=false'
      )
    })

    it('returns true when oauthSessionIsLoggedIn is true, prompt = login and scope = openid', async () => {
      const qp = { prompt: 'login', scope: 'openid' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session, true)
      expect(result).toBeTrue()
    })

    it('redirects to /oauth/authorize when oauthSessionIsLoggedIn is true, prompt = login and scope != openid', async () => {
      const qp = { prompt: 'login', scope: 'email' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      }
      const result = await runGuard(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?prompt=login&scope=email'
      )
    })

    it('redirects to /register when orcid present and show_login is false', async () => {
      const qp = { orcid: '0000-0002-1825-0097', show_login: 'false' }
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      }
      const result = await runGuard(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/register?orcid=0000-0002-1825-0097&show_login=false'
      )
    })
  })
})
