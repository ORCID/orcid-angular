import { TestBed } from '@angular/core/testing'
import { Router, UrlTree } from '@angular/router'
import { of } from 'rxjs'

import { AuthorizeGuard } from './authorize.guard'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { TogglzService } from '../core/togglz/togglz.service'

describe('AuthorizeGuard', () => {
  let guard: AuthorizeGuard
  let user: jasmine.SpyObj<UserService>
  let router: jasmine.SpyObj<Router>
  let platform: jasmine.SpyObj<PlatformInfoService>

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
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

    TestBed.configureTestingModule({
      providers: [
        AuthorizeGuard,
        { provide: UserService, useValue: user },
        { provide: Router, useValue: router },
        { provide: PlatformInfoService, useValue: platform },
        { provide: WINDOW, useValue: { location: { href: 'href' } } },
        { provide: TogglzService, useValue: { getStateOf: () => of(false) } },
      ],
    })

    guard = TestBed.inject(AuthorizeGuard)
  })

  // --------------------------------------------------------------------------
  // Test cases
  // --------------------------------------------------------------------------

  it('redirects locked accounts to /my-orcid', (done) => {
    user.getUserSession.and.returnValue(
      of({ userInfo: { LOCKED: 'true' } } as any)
    )
    router.createUrlTree.and.returnValue(stubUrlTree('/my-orcid'))

    guard.canActivateChild({} as any, {} as any).subscribe((result) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/my-orcid'])
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
      done()
    })
  })

  it('allows navigation when oauthSession.error is set', (done) => {
    user.getUserSession.and.returnValue(
      of({ oauthSession: { error: 'anything' } } as any)
    )

    guard.canActivateChild({} as any, {} as any).subscribe((result) => {
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
      done()
    })
  })

  it('redirects to /signin when forceLogin is true', (done) => {
    user.getUserSession.and.returnValue(
      of({ oauthSession: { forceLogin: true } } as any)
    )
    platform.get.and.returnValue(of({ queryParameters: { foo: 'bar' } } as any))
    router.createUrlTree.and.callFake((segments: any, opts: any) =>
      stubUrlTree(segments[0], opts.queryParams)
    )

    guard.canActivateChild({} as any, {} as any).subscribe((result) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { foo: 'bar' },
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
      done()
    })
  })

  it('redirects to /signin when NOT logged-in and no error', (done) => {
    user.getUserSession.and.returnValue(
      of({
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as any)
    )
    platform.get.and.returnValue(of({ queryParameters: {} } as any))
    router.createUrlTree.and.returnValue(stubUrlTree('/signin'))

    guard.canActivateChild({} as any, {} as any).subscribe((result) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: {},
      })
      expect(result).toBe(router.createUrlTree.calls.mostRecent().returnValue)
      done()
    })
  })

  it('allows navigation when logged-in and no error', (done) => {
    user.getUserSession.and.returnValue(
      of({
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as any)
    )

    guard.canActivateChild({} as any, {} as any).subscribe((result) => {
      expect(result).toBeTrue()
      expect(router.createUrlTree).not.toHaveBeenCalled()
      done()
    })
  })
})
