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
  /**
   * Stable machine-friendly reason code for observability and analytics.
   * Keep compact and avoid embedding user input.
   */
  reason?: string
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
      return { action: 'allow', trace, reason: 'no_oauth_session' }
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
          ? { action: 'allow', trace, reason: 'identifier_user_exists' }
          : {
              action: 'redirectToRegister',
              trace,
              payload: { queryParams },
              reason: 'identifier_user_missing',
            }
      }
      trace.push('Legacy: allow (no identifier)')
      return { action: 'allow', trace, reason: 'not_logged_no_identifier' }
    }

    if (!session.oauthSession?.forceLogin) {
      trace.push(
        'Legacy: logged in and backend responds with forceLogin=false → redirectToAuthorize'
      )
      return {
        action: 'redirectToAuthorize',
        trace,
        payload: { queryParams },
        reason: 'logged_in_not_force_login',
      }
    }

    trace.push(
      'Legacy: Backend responds with forceLogin=true → allow to show login'
    )
    return { action: 'allow', trace, reason: 'force_login_required' }
  }

  private decideSignInOAuth2(
    session: UserSession,
    queryParams: OauthParameters,
    trace: string[]
  ): AuthDecisionResult {
    const showLoginIsFalse = queryParams?.show_login === 'false'
    const userIsLoggedIn = !!session?.oauthSessionIsLoggedIn
    const isOpenId = queryParams?.scope?.includes('openid')
    const forceLoginByPrompt = queryParams?.prompt === 'login' && isOpenId

    if (!userIsLoggedIn) {
      trace.push('OAuth2: not logged in')
      if (showLoginIsFalse) {
        trace.push("OAuth2: show_login === 'false' → redirectToRegister")
        return {
          action: 'redirectToRegister',
          trace,
          payload: { queryParams },
          reason: 'show_login_false',
        }
      }
      trace.push('OAuth2: allow (go to login)')
      return { action: 'allow', trace, reason: 'not_logged' }
    }

    // HANDLE CASES WHERE THE USER IS LOGGED IN

    // Prompt login and scope openid are required to show the login
    if (!forceLoginByPrompt) {
      trace.push(
        'OAuth2: logged in and not prompt=login on openid → redirectToAuthorize'
      )
      return {
        action: 'redirectToAuthorize',
        trace,
        payload: { queryParams },
        reason: 'logged_in_not_forced_prompt_login',
      }
    }
    trace.push('OAuth2: prompt=login with openid → allow (show login)')
    return { action: 'allow', trace, reason: 'prompt_login_with_openid' }
  }

  decideForAuthorize(
    session: UserSession,
    isOauthAuthorizationTogglzEnable: boolean,
    queryParams: OauthParameters
  ): AuthDecisionResult {
    const trace: string[] = []

    if (session?.userInfo?.LOCKED === 'true') {
      trace.push('Account locked → redirectToMyOrcid')
      return {
        action: 'redirectToMyOrcid',
        trace,
        reason: 'account_locked',
      }
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
    return { action: 'redirectToLogin', trace, reason: 'no_oauth_session' }
  }

  private decideAuthorizeLegacy(
    session: UserSession,
    trace: string[]
  ): AuthDecisionResult {
    const { error, forceLogin } = session.oauthSession || ({} as any)
    if (error) {
      trace.push('Legacy: error present → allow (show error)')
      return { action: 'allow', trace, reason: 'legacy_session_error' }
    }
    if (forceLogin || !session.oauthSessionIsLoggedIn) {
      trace.push('Legacy: forceLogin or not logged → redirectToLogin')
      return {
        action: 'redirectToLogin',
        trace,
        reason: forceLogin ? 'legacy_force_login' : 'legacy_not_logged',
      }
    }
    trace.push('Legacy: allow')
    return { action: 'allow', trace, reason: 'legacy_allow' }
  }

  private decideAuthorizeOAuth2(
    session: UserSession,
    queryParams: OauthParameters,
    trace: string[]
  ): AuthDecisionResult {
    const isOpenId = queryParams?.scope?.includes('openid')
    const forceLoginByPrompt = queryParams?.prompt === 'login' && isOpenId

    if (!session.oauthSessionIsLoggedIn && queryParams?.prompt === 'none') {
      trace.push("OAuth2: prompt='none' and not logged → validateRedirectUri")
      return {
        action: 'validateRedirectUri',
        trace,
        payload: {
          clientId: queryParams.client_id,
          redirectUri: queryParams.redirect_uri,
        },
        reason: 'prompt_none_not_logged',
      }
    }

    if (session.oauthSessionIsLoggedIn && queryParams?.prompt === 'none') {
      const target = (session.oauthSession as any)?.redirectUrl
      if (isOpenId && target) {
        trace.push(
          "OAuth2: prompt='none' (openid) and logged with and backend responds with redirectUrl → outOfRouterNavigation"
        )
        return {
          action: 'outOfRouterNavigation',
          trace,
          payload: { target },
          reason: 'prompt_none_logged_openid_with_target',
        }
      }
      trace.push(
        "OAuth2: prompt='none' but not openid or missing redirectUrl → allow"
      )
      return {
        action: 'allow',
        trace,
        reason: isOpenId
          ? 'prompt_none_logged_openid_missing_target'
          : 'prompt_none_logged_non_openid',
      }
    }

    if (!session.oauthSessionIsLoggedIn || forceLoginByPrompt) {
      trace.push(
        'OAuth2: not logged or forced by prompt+openid → redirectToLogin'
      )
      return {
        action: 'redirectToLogin',
        trace,
        reason: !session.oauthSessionIsLoggedIn
          ? 'oauth2_not_logged'
          : 'prompt_login_with_openid',
      }
    }

    trace.push('OAuth2: allow')
    return { action: 'allow', trace, reason: 'oauth2_allow' }
  }
}
