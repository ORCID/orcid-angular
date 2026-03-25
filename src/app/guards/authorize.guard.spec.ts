import { TestBed } from '@angular/core/testing'
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import { of, firstValueFrom, NEVER, from, timeout } from 'rxjs'

import { AuthorizeGuard } from './authorize.guard'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { TogglzService } from '../core/togglz/togglz.service'
import { AuthDecisionService } from '../core/auth-decision/auth-decision.service'
import { OauthService } from '../core/oauth/oauth.service'

describe('AuthorizeGuard', () => {
  let guard: AuthorizeGuard
  let user: jasmine.SpyObj<UserService>
  let router: jasmine.SpyObj<Router>
  let platform: jasmine.SpyObj<PlatformInfoService>
  let togglz: { getStateOf: jasmine.Spy }
  let oauthService: { validateRedirectUri: jasmine.Spy }
  let decisionMock: { decideForAuthorize: jasmine.Spy }
  let win: { location: { href: string }; outOfRouterNavigation: jasmine.Spy }
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
    decisionMock = {
      decideForAuthorize: jasmine.createSpy('decideForAuthorize'),
    }

    win = {
      location: { href: 'href' },
      outOfRouterNavigation: jasmine.createSpy('outOfRouterNavigation'),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthorizeGuard,
        { provide: UserService, useValue: user },
        { provide: Router, useValue: router },
        { provide: PlatformInfoService, useValue: platform },
        { provide: WINDOW, useValue: win },
        { provide: TogglzService, useValue: togglz },
        { provide: OauthService, useValue: oauthService },
        { provide: AuthDecisionService, useValue: decisionMock },
      ],
    })

    guard = TestBed.inject(AuthorizeGuard)
  })

  function makeSnapshot(queryParams: any): ActivatedRouteSnapshot {
    return { queryParams } as unknown as ActivatedRouteSnapshot
  }

  async function runGuardHelper(
    qp: any,
    session: any,
    togglzValue: boolean = false
  ) {
    togglz.getStateOf.and.returnValue(of(togglzValue))
    user.getUserSession.and.returnValue(of(session))
    const result = (await firstValueFrom(
      guard.canActivateChild(makeSnapshot(qp), {} as RouterStateSnapshot)
    )) as boolean | UrlTree
    return result
  }

  describe('integration with AuthDecisionService', () => {
    it('calls decision service with session, togglz, and queryParams', async () => {
      const qp = { a: '1' }
      const session = { oauthSession: {} }
      decisionMock.decideForAuthorize.and.returnValue({
        action: 'allow',
        trace: [],
      })

      const result = await runGuardHelper(qp, session, true)
      expect(decisionMock.decideForAuthorize).toHaveBeenCalledWith(
        session as any,
        true,
        qp as any
      )
      expect(result).toBeTrue()
    })

    it("creates UrlTree to '/signin' when action is redirectToLogin (preserves query)", async () => {
      platform.get.and.returnValue(
        of({ queryParameters: { foo: 'bar' } } as any)
      )
      router.createUrlTree.and.callFake((segments: any, opts: any) =>
        stubUrlTree(segments[0], opts.queryParams)
      )
      decisionMock.decideForAuthorize.and.returnValue({
        action: 'redirectToLogin',
        trace: [],
      })

      const result = await runGuardHelper({ x: 1 }, { oauthSession: {} }, true)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { foo: 'bar' },
      })
      expect(result).toEqual(stubUrlTree('/signin', { foo: 'bar' }))
    })

    it("returns UrlTree '/my-orcid' when action is redirectToMyOrcid", async () => {
      router.createUrlTree.and.returnValue(stubUrlTree('/my-orcid'))
      decisionMock.decideForAuthorize.and.returnValue({
        action: 'redirectToMyOrcid',
        trace: [],
      })
      const result = await runGuardHelper({}, { userInfo: {} }, false)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/my-orcid'])
      expect(result).toEqual(stubUrlTree('/my-orcid'))
    })

    it('triggers outOfRouterNavigation when action is outOfRouterNavigation', async () => {
      decisionMock.decideForAuthorize.and.returnValue({
        action: 'outOfRouterNavigation',
        trace: [],
        payload: { target: 'https://cb' },
      })
      const result = runGuardHelper({}, { oauthSession: {} }, true)
      expect(win.outOfRouterNavigation).toHaveBeenCalledWith('https://cb')
      // Expect a promise that never resolves
      expect(result).toBeInstanceOf(Promise)
      // Test that it never emits by trying to get first value with timeout
      await expectAsync(
        firstValueFrom(from(result).pipe(timeout(100)))
      ).toBeRejected()
    })

    it('validates redirect and navigates when action is validateRedirectUri', async () => {
      oauthService.validateRedirectUri.and.returnValue(
        of({ valid: true }) as any
      )
      decisionMock.decideForAuthorize.and.returnValue({
        action: 'validateRedirectUri',
        trace: [],
        payload: { clientId: 'c', redirectUri: 'https://cb' },
      })
      const result = await runGuardHelper({}, { oauthSession: {} }, true)
      expect(oauthService.validateRedirectUri).toHaveBeenCalledWith(
        'c',
        'https://cb'
      )
      expect(result).toBeFalse()
    })
  })
})
