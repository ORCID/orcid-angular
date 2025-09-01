import { TestBed } from '@angular/core/testing'
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import { of, firstValueFrom } from 'rxjs'

import { AuthorizeGuard } from './authorize.guard'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { TogglzService } from '../core/togglz/togglz.service'
import { OauthService } from '../core/oauth/oauth.service'

describe('AuthorizeGuard', () => {
  let guard: AuthorizeGuard
  let user: jasmine.SpyObj<UserService>
  let router: jasmine.SpyObj<Router>
  let platform: jasmine.SpyObj<PlatformInfoService>
  let togglz: { getStateOf: jasmine.Spy }
  let oauthService: { validateRedirectUri: jasmine.Spy }
  function stubUrlTree(
    path: string,
    query: Record<string, unknown> = {}
  ): UrlTree {
    return { __path: path, __query: query } as unknown as UrlTree
  }

  beforeEach(() => {
    user = jasmine.createSpyObj('UserService', ['getUserSession'])
    router = jasmine.createSpyObj('Router', ['createUrlTree'])
    platform = jasmine.createSpyObj('PlatformInfoService', ['get'])
    togglz = { getStateOf: jasmine.createSpy('getStateOf') }
    oauthService = {
      validateRedirectUri: jasmine.createSpy('validateRedirectUri'),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthorizeGuard,
        { provide: UserService, useValue: user },
        { provide: Router, useValue: router },
        { provide: PlatformInfoService, useValue: platform },
        { provide: WINDOW, useValue: { location: { href: 'href' } } },
        { provide: TogglzService, useValue: togglz },
        { provide: OauthService, useValue: oauthService },
      ],
    })

    guard = TestBed.inject(AuthorizeGuard)
  })

  function makeSnapshot(queryParams: any): ActivatedRouteSnapshot {
    return { queryParams } as unknown as ActivatedRouteSnapshot
  }

  async function runGuard(qp: any, session: any, togglzValue: boolean = false) {
    togglz.getStateOf.and.returnValue(of(togglzValue))
    user.getUserSession.and.returnValue(of(session))
    const result = (await firstValueFrom(
      guard.canActivateChild(makeSnapshot(qp), {} as RouterStateSnapshot)
    )) as boolean | UrlTree
    return result
  }

  describe('OAUTH_AUTHORIZATION Disabled', () => {
    it('redirects locked accounts to /my-orcid', async () => {
      router.createUrlTree.and.returnValue(stubUrlTree('/my-orcid'))
      const session = { userInfo: { LOCKED: 'true' } } as any
      const result = await runGuard({}, session)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/my-orcid'])
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('allows navigation when oauthSession.error is set', async () => {
      const session = { oauthSession: { error: 'anything' } } as any
      const result = await runGuard({}, session)
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
    })

    it('redirects to /signin when forceLogin is true', async () => {
      platform.get.and.returnValue(
        of({ queryParameters: { foo: 'bar' } } as any)
      )
      router.createUrlTree.and.callFake((segments: any, opts: any) =>
        stubUrlTree(segments[0], opts.queryParams)
      )
      const session = { oauthSession: { forceLogin: true } } as any
      const result = await runGuard({}, session)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { foo: 'bar' },
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('redirects to /signin when NOT logged-in and no error', async () => {
      platform.get.and.returnValue(of({ queryParameters: {} } as any))
      router.createUrlTree.and.returnValue(stubUrlTree('/signin'))

      const session = { oauthSession: {}, oauthSessionIsLoggedIn: false } as any
      const result = await runGuard({}, session, true)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: {},
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('allows navigation when logged-in and no error', async () => {
      const session = { oauthSession: {}, oauthSessionIsLoggedIn: true } as any
      const result = await runGuard({}, session)
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
    })

    it('redirects to /signin when no oauthSession present', async () => {
      platform.get.and.returnValue(of({ queryParameters: { x: '1' } } as any))
      router.createUrlTree.and.callFake((segments: any, opts: any) =>
        stubUrlTree(segments[0], opts.queryParams)
      )

      const session = { oauthSession: undefined } as any
      const result = await runGuard({ any: 'qp' }, session)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { x: '1' },
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('allows navigation when error is set even if forceLogin is true', async () => {
      const session = {
        oauthSession: { error: 'err', forceLogin: true },
        oauthSessionIsLoggedIn: false,
      } as any
      const result = await runGuard({}, session)
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
    })
  })
  fdescribe('OAUTH_AUTHORIZATION Enable', () => {
    it('redirects locked accounts to /my-orcid', async () => {
      router.createUrlTree.and.returnValue(stubUrlTree('/my-orcid'))
      const session = { userInfo: { LOCKED: 'true' } } as any
      const result = await runGuard({}, session, true)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/my-orcid'])
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('Send the user to /signif not logged in', async () => {
      oauthService.validateRedirectUri.and.returnValue(of(true))
      platform.get.and.returnValue(of({ queryParameters: { x: '1' } } as any))
      const session = {}
      const result = await runGuard({}, session, true)
      // `/signin` and any Object
      expect(router.createUrlTree).toHaveBeenCalledWith(
        ['/signin'],
        jasmine.any(Object)
      )
    })

    it('redirects to /signin when prompt = login', async () => {
      platform.get.and.returnValue(
        of({ queryParameters: { foo: 'bar' } } as any)
      )
      router.createUrlTree.and.callFake((segments: any, opts: any) =>
        stubUrlTree(segments[0], opts.queryParams)
      )
      const session = { oauthSession: { forceLogin: true } } as any
      const result = await runGuard(
        { queryParams: { prompt: 'login' } },
        session,
        true
      )
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { foo: 'bar' },
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('redirects to /signin when NOT logged-in', async () => {
      platform.get.and.returnValue(of({ queryParameters: {} } as any))
      router.createUrlTree.and.returnValue(stubUrlTree('/signin'))

      const session = { oauthSession: {}, oauthSessionIsLoggedIn: false } as any
      const result = await runGuard({}, session, true)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: {},
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('allows navigation when logged-in and no error', async () => {

      const session = { oauthSession: {}, oauthSessionIsLoggedIn: true } as any
      const result = await runGuard({}, session, true)
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
    })

    it('redirects to /signin when no oauthSession present', async () => {
      platform.get.and.returnValue(of({ queryParameters: { x: '1' } } as any))
      router.createUrlTree.and.callFake((segments: any, opts: any) =>
        stubUrlTree(segments[0], opts.queryParams)
      )

      const session = { oauthSession: undefined } as any
      const result = await runGuard({ any: 'qp' }, session, true)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { x: '1' },
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
    })

    it('allows navigation when logged-in and there is an error', async () => {
      const session = {
        oauthSession: { error: 'err', forceLogin: true },
        oauthSessionIsLoggedIn: true,
      } as any
      const result = await runGuard({}, session, true)
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
    })
  })
})
