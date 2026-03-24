import { getOauthAuthorizationErrorCategory } from './oauth-authorization-error-category'

describe('getOauthAuthorizationErrorCategory', () => {
  it('returns invalid_scope', () => {
    expect(getOauthAuthorizationErrorCategory('invalid_scope')).toBe('invalid_scope')
  })

  it('returns redirect_uri_invalid for redirect-related errors', () => {
    expect(
      getOauthAuthorizationErrorCategory(undefined, 'redirect_uri mismatch')
    ).toBe('redirect_uri_invalid')
  })

  it('returns unknown for empty input', () => {
    expect(getOauthAuthorizationErrorCategory(undefined, undefined)).toBe('unknown')
  })
})
