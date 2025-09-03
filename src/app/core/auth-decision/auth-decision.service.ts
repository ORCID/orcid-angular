import { Injectable } from '@angular/core'

import { OauthParameters } from '../../types'
import { UserSession } from '../../types/session.local'

export type AuthDecisionAction =
  | 'allow'
  | 'redirectToAuthorize'
  | 'redirectToRegister'
  | 'redirectToLogin'
  | 'redirectToMyOrcid'
  | 'outOfRouterNavigation'
  | 'validateRedirectUri'

export interface AuthDecisionResult {
  action: AuthDecisionAction
  trace: string[]
  payload?: unknown
}

@Injectable({ providedIn: 'root' })
export class AuthDecisionService {
  decideForSignIn(
    session: UserSession,
    isOauthAuthorizationTogglzEnable: boolean,
    queryParams: OauthParameters
  ): AuthDecisionResult {
    const trace: string[] = []

    const hasOauth = !!session?.oauthSession
    const loggedIn = !!session?.oauthSessionIsLoggedIn
    trace.push(`hasOauthSession=${hasOauth}`, `loggedIn=${loggedIn}`)

    if (!hasOauth) {
      trace.push('No oauthSession → allow to show login')
      return { action: 'allow', trace }
    }

    if (!isOauthAuthorizationTogglzEnable) {
      trace.push('Legacy OAuth flow')
      return this.decideSignInLegacy(session, queryParams, trace)
    }

    trace.push('OAuth2 flow')
    return this.decideSignInOAuth2(session, queryParams, trace)
  }

  private decideSignInLegacy(
    session: UserSession,
    queryParams: OauthParameters,
    trace: string[]
  ): AuthDecisionResult {
    const hasUserIdentifier = !!(queryParams?.email || queryParams?.orcid)
    const showLoginIsFalse = queryParams?.show_login === 'false'
    const userIsLoggedIn = !!session?.oauthSessionIsLoggedIn

    if (!userIsLoggedIn) {
      trace.push(
        `Legacy: not logged in; hasIdentifier=${hasUserIdentifier}; show_login is false?=${showLoginIsFalse}`
      )
      if (hasUserIdentifier || showLoginIsFalse) {
        const userExists = !!session?.oauthSession?.userId
        trace.push(
          `Legacy: has identifier or show_login=false → ${
            userExists
              ? 'allow (existing user)'
              : 'redirectToRegister (user does not exist)'
          }`
        )
        return userExists
          ? { action: 'allow', trace }
          : { action: 'redirectToRegister', trace, payload: { queryParams } }
      }
      trace.push('Legacy: allow (no identifier)')
      return { action: 'allow', trace }
    }

    if (!session.oauthSession?.forceLogin) {
      trace.push(
        'Legacy: logged in and backend responds with forceLogin=false → redirectToAuthorize'
      )
      return { action: 'redirectToAuthorize', trace, payload: { queryParams } }
    }

    trace.push(
      'Legacy: Backend responds with forceLogin=true → allow to show login'
    )
    return { action: 'allow', trace }
  }

  private decideSignInOAuth2(
    session: UserSession,
    queryParams: OauthParameters,
    trace: string[]
  ): AuthDecisionResult {
    const showLoginIsFalse = queryParams?.show_login === 'false'
    const userIsLoggedIn = !!session?.oauthSessionIsLoggedIn
    const scopeIsOpenId = queryParams?.scope === 'openid'
    const promptLogin = queryParams?.prompt === 'login'

    if (!userIsLoggedIn) {
      trace.push('OAuth2: not logged in')
      if (showLoginIsFalse) {
        trace.push("OAuth2: show_login === 'false' → redirectToRegister")
        return { action: 'redirectToRegister', trace, payload: { queryParams } }
      }
      trace.push('OAuth2: allow (go to login)')
      return { action: 'allow', trace }
    }

    // HANDLE CASES WHERE THE USER IS LOGGED IN

    // Prompt login and scope openid are required to show the login
    if (!(promptLogin && scopeIsOpenId)) {
      trace.push(
        'OAuth2: logged in and not prompt=login on openid → redirectToAuthorize'
      )
      return { action: 'redirectToAuthorize', trace, payload: { queryParams } }
    }
    trace.push('OAuth2: prompt=login with openid → allow (show login)')
    return { action: 'allow', trace }
  }

  decideForAuthorize(
    session: UserSession,
    isOauthAuthorizationTogglzEnable: boolean,
    queryParams: OauthParameters
  ): AuthDecisionResult {
    const trace: string[] = []

    if (session?.userInfo?.LOCKED === 'true') {
      trace.push('Account locked → redirectToMyOrcid')
      return { action: 'redirectToMyOrcid', trace }
    }

    const hasOauth = !!session?.oauthSession
    trace.push(`hasOauthSession=${hasOauth}`)

    if (hasOauth && !isOauthAuthorizationTogglzEnable) {
      trace.push('Legacy OAuth flow')
      return this.decideAuthorizeLegacy(session, trace)
    }

    if (hasOauth && isOauthAuthorizationTogglzEnable) {
      trace.push('OAuth2 flow')
      return this.decideAuthorizeOAuth2(session, queryParams, trace)
    }

    trace.push('No oauthSession → redirectToLogin')
    return { action: 'redirectToLogin', trace }
  }

  private decideAuthorizeLegacy(
    session: UserSession,
    trace: string[]
  ): AuthDecisionResult {
    const { error, forceLogin } = session.oauthSession || ({} as any)
    if (error) {
      trace.push('Legacy: error present → allow (show error)')
      return { action: 'allow', trace }
    }
    if (forceLogin || !session.oauthSessionIsLoggedIn) {
      trace.push('Legacy: forceLogin or not logged → redirectToLogin')
      return { action: 'redirectToLogin', trace }
    }
    trace.push('Legacy: allow')
    return { action: 'allow', trace }
  }

  private decideAuthorizeOAuth2(
    session: UserSession,
    queryParams: OauthParameters,
    trace: string[]
  ): AuthDecisionResult {
    const scopeIsOpenId = queryParams?.scope === 'openid'
    const forceLoginByPrompt = queryParams?.prompt === 'login' && scopeIsOpenId

    if (!session.oauthSessionIsLoggedIn && queryParams?.prompt === 'none') {
      trace.push("OAuth2: prompt='none' and not logged → validateRedirectUri")
      return {
        action: 'validateRedirectUri',
        trace,
        payload: {
          clientId: queryParams.client_id,
          redirectUri: queryParams.redirect_uri,
        },
      }
    }

    if (session.oauthSessionIsLoggedIn && queryParams?.prompt === 'none') {
      const isOpenId = queryParams?.scope === 'openid'
      const target = (session.oauthSession as any)?.redirectUrl
      if (isOpenId && target) {
        trace.push(
          "OAuth2: prompt='none' (openid) and logged with and backend responds with redirectUrl → outOfRouterNavigation"
        )
        return { action: 'outOfRouterNavigation', trace, payload: { target } }
      }
      trace.push(
        "OAuth2: prompt='none' but not openid or missing redirectUrl → allow"
      )
      return { action: 'allow', trace }
    }

    if (!session.oauthSessionIsLoggedIn || forceLoginByPrompt) {
      trace.push(
        'OAuth2: not logged or forced by prompt+openid → redirectToLogin'
      )
      return { action: 'redirectToLogin', trace }
    }

    trace.push('OAuth2: allow')
    return { action: 'allow', trace }
  }
}
