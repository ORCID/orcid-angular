import { TestBed } from '@angular/core/testing'

import { AuthDecisionService } from './auth-decision.service'
import { OauthParameters } from '../../types'
import { UserSession } from '../../types/session.local'

describe('AuthDecisionService', () => {
  let service: AuthDecisionService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AuthDecisionService)
  })

  describe('decideForSignIn (Legacy)', () => {
    it('allows when no oauthSession', () => {
      const session = { oauthSession: undefined } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('allow')
    })

    it('redirects to register when identifier present and user does not exist', () => {
      const session = {
        oauthSession: { userId: undefined },
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = { email: 'a@b.com' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('redirectToRegister')
    })

    it('allows when identifier present and user exists', () => {
      const session = {
        oauthSession: { userId: 'u1' },
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = { email: 'a@b.com' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('allow')
    })

    it('redirects to authorize when logged in and not forceLogin', () => {
      const session = {
        oauthSession: { forceLogin: false },
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = { client_id: 'c' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('redirectToAuthorize')
    })

    it('allows when not logged in and no identifier/show_login=false', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('allow')
    })

    it("redirects to register when show_login='false' and user does not exist", () => {
      const session = {
        oauthSession: { userId: undefined },
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = { show_login: 'false' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('redirectToRegister')
    })

    it("allows when show_login='false' and user exists", () => {
      const session = {
        oauthSession: { userId: 'u1' },
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = { show_login: 'false' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('allow')
    })

    it('allows when logged in and forceLogin is true', () => {
      const session = {
        oauthSession: { forceLogin: true },
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForSignIn(session, false, qp)
      expect(res.action).toBe('allow')
    })
  })

  describe('decideForSignIn (OAuth2)', () => {
    it("redirects to register when show_login='false' and not logged", () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = { show_login: 'false' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('redirectToRegister')
    })

    it('redirects to authorize when logged in and prompt!=login on openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = { scope: 'email' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('redirectToAuthorize')
    })

    it('allows when logged in and prompt=login with openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        scope: 'openid',
        prompt: 'login',
      } as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('allow')
    })

    it('allows when logged in and prompt=login with openid and other scope', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        scope: 'openid /read-limited',
        prompt: 'login',
      } as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('allow')
    })

    it('allows when not logged in and no show_login=false', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {} as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('allow')
    })

    it('redirects to authorize when logged in and prompt=login but scope!=openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        scope: '/read-limited',
        prompt: 'login',
      } as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('redirectToAuthorize')
    })

    it('redirects to authorize when logged in and scope=openid with no prompt', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = { scope: 'openid' } as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('redirectToAuthorize')
    })

    it('allows when no oauthSession', () => {
      const session = {
        oauthSession: undefined,
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {} as unknown as OauthParameters
      const res = service.decideForSignIn(session, true, qp)
      expect(res.action).toBe('allow')
    })
  })

  describe('decideForAuthorize (Common)', () => {
    it('redirects to my-orcid when account locked', () => {
      const session = { userInfo: { LOCKED: 'true' } } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToMyOrcid')
    })

    it('redirects to login when no oauthSession', () => {
      const session = { oauthSession: undefined } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToLogin')
    })
  })

  describe('decideForAuthorize (Legacy)', () => {
    it('allows when error present', () => {
      const session = {
        oauthSession: { error: 'bad' },
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForAuthorize(session, false, qp)
      expect(res.action).toBe('allow')
    })

    it('redirects to login when forceLogin or not logged', () => {
      const session = {
        oauthSession: { forceLogin: true },
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForAuthorize(session, false, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('redirects to login when not logged and no forceLogin', () => {
      const session = {
        oauthSession: { forceLogin: false },
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForAuthorize(session, false, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('allows when logged in and no error/forceLogin', () => {
      const session = {
        oauthSession: { forceLogin: false },
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {} as OauthParameters
      const res = service.decideForAuthorize(session, false, qp)
      expect(res.action).toBe('allow')
    })
  })

  describe('decideForAuthorize (OAuth2)', () => {
    it("returns validateRedirectUri when prompt='none' and not logged", () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {
        prompt: 'none',
        client_id: 'c',
        redirect_uri: 'https://cb',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('validateRedirectUri')
      expect((res.payload as any).clientId).toBe('c')
      expect((res.payload as any).redirectUri).toBe('https://cb')
    })

    it("returns outOfRouterNavigation when prompt='none', logged, scope=openId and redirectUrl exists", () => {
      const session = {
        oauthSession: { redirectUrl: 'https://cb#something' },
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        prompt: 'none',
        scope: 'openid',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('outOfRouterNavigation')
      expect((res.payload as any).target).toBe('https://cb#something')
    })

    it("allows when prompt='none', logged, scope=openId but missing backend redirectUrl", () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        prompt: 'none',
        scope: 'openid',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('allow')
    })

    it("allows when prompt='none', logged, but not openid or missing backend redirectUrl", () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        prompt: 'none',
        scope: 'email',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('allow')
    })

    it('redirects to login when not logged or forced by prompt+openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {
        prompt: 'login',
        scope: 'openid',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('redirects to login when not logged or forced by prompt+openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {
        prompt: 'login',
        scope: 'openid /read-limited',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('redirects to login when not logged and prompt not equal to none', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: false,
      } as unknown as UserSession
      const qp = {} as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('redirects to login when logged and forced by prompt=login+openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        prompt: 'login',
        scope: 'openid',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('redirects to login when logged and forced by prompt=login+openid', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {
        prompt: 'login',
        scope: 'openid /read-limited',
      } as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('redirectToLogin')
    })

    it('allows when logged, prompt not none/login', () => {
      const session = {
        oauthSession: {},
        oauthSessionIsLoggedIn: true,
      } as unknown as UserSession
      const qp = {} as unknown as OauthParameters
      const res = service.decideForAuthorize(session, true, qp)
      expect(res.action).toBe('allow')
    })
  })
})
