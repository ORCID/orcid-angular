/**
 * Normalized bucket for OAuth authorize URL / session validation failures (dashboards / NRQL).
 * Uses RFC 6749-style `error` values when present.
 */
export function getOauthAuthorizationErrorCategory(
  oauthError: string | undefined,
  oauthErrorCode?: string
): string {
  const raw = `${oauthError || ''} ${oauthErrorCode || ''}`.trim().toLowerCase()
  if (!raw) {
    return 'unknown'
  }

  const checks: Array<{ match: (s: string) => boolean; category: string }> = [
    { match: (s) => s.includes('invalid_scope'), category: 'invalid_scope' },
    { match: (s) => s.includes('invalid_client'), category: 'invalid_client' },
    {
      match: (s) =>
        s.includes('redirect_uri') ||
        s.includes('redirect uri') ||
        s.includes('invalid_redirect'),
      category: 'redirect_uri_invalid',
    },
    {
      match: (s) => s.includes('invalid_request'),
      category: 'invalid_request',
    },
    {
      match: (s) => s.includes('unsupported_response_type'),
      category: 'unsupported_response_type',
    },
    { match: (s) => s.includes('access_denied'), category: 'access_denied' },
    { match: (s) => s.includes('invalid_grant'), category: 'invalid_grant' },
    {
      match: (s) => s.includes('unauthorized_client'),
      category: 'unauthorized_client',
    },
    { match: (s) => s.includes('client_locked'), category: 'client_locked' },
    {
      match: (s) => s.includes('interaction_required'),
      category: 'interaction_required',
    },
    { match: (s) => s.includes('login_required'), category: 'login_required' },
    { match: (s) => s.includes('oauth_error'), category: 'oauth_error' },
  ]

  for (const { match, category } of checks) {
    if (match(raw)) {
      return category
    }
  }

  return 'other'
}
