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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of, firstValueFrom } from 'rxjs'
import { UserService } from '../core/user/user.service'
import { TogglzService } from '../core/togglz/togglz.service'
import { AuthDecisionService } from '../core/auth-decision/auth-decision.service'

describe('SignInGuard', () => {
  let guard: SignInGuard
  let router: Router
  let userServiceMock: { getUserSession: jasmine.Spy }
  let togglzServiceMock: { getStateOf: jasmine.Spy }
  let decisionMock: { decideForSignIn: jasmine.Spy }

  beforeEach(() => {
    userServiceMock = {
      getUserSession: jasmine.createSpy('getUserSession'),
    }
    togglzServiceMock = {
      getStateOf: jasmine.createSpy('getStateOf'),
    }
    decisionMock = {
      decideForSignIn: jasmine.createSpy('decideForSignIn'),
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: TogglzService, useValue: togglzServiceMock },
        { provide: AuthDecisionService, useValue: decisionMock },
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

  async function runGuardHelper(qp: any, session: any, toglz: boolean = false) {
    togglzServiceMock.getStateOf.and.returnValue(of(toglz))
    userServiceMock.getUserSession.and.returnValue(of(session))
    const result = (await firstValueFrom(
      guard.canActivateChild(makeSnapshot(qp), {} as RouterStateSnapshot) as any
    )) as boolean | UrlTree
    return result
  }
  describe('integration with AuthDecisionService', () => {
    it('calls decision service with session, togglz, and queryParams', async () => {
      const qp = { a: '1' }
      const session = { oauthSession: {} }
      decisionMock.decideForSignIn.and.returnValue({
        action: 'allow',
        trace: [],
      })

      await runGuardHelper(qp, session, true)

      expect(decisionMock.decideForSignIn).toHaveBeenCalledWith(
        session as any,
        true,
        qp as any
      )
    })

    it("returns UrlTree to '/oauth/authorize' when action is redirectToAuthorize", async () => {
      const qp = { client_id: 'abc' }
      const session = { oauthSession: {} }
      decisionMock.decideForSignIn.and.returnValue({
        action: 'redirectToAuthorize',
        trace: [],
        payload: { queryParams: qp },
      })
      const result = await runGuardHelper(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe(
        '/oauth/authorize?client_id=abc'
      )
    })

    it("returns UrlTree to '/register' when action is redirectToRegister", async () => {
      const qp = { email: 'e@x' }
      const session = { oauthSession: {} }
      decisionMock.decideForSignIn.and.returnValue({
        action: 'redirectToRegister',
        trace: [],
        payload: { queryParams: qp },
      })
      const result = await runGuardHelper(qp, session, true)
      expect(result instanceof UrlTree).toBeTrue()
      expect(router.serializeUrl(result as UrlTree)).toBe('/register?email=e@x')
    })

    it('returns true when action is allow', async () => {
      const qp = {}
      const session = { oauthSession: {} }
      decisionMock.decideForSignIn.and.returnValue({
        action: 'allow',
        trace: [],
      })
      const result = await runGuardHelper(qp, session, true)
      expect(result).toBeTrue()
    })
  })
})
