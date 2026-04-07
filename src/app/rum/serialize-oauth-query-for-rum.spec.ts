import { serializeQueryParamsForRum } from './serialize-oauth-query-for-rum'

describe('serializeQueryParamsForRum', () => {
  it('returns undefined for empty or missing params', () => {
    expect(serializeQueryParamsForRum(undefined)).toBeUndefined()
    expect(serializeQueryParamsForRum({})).toBeUndefined()
  })

  it('serializes sorted keys and preserves multiple values', () => {
    const q = serializeQueryParamsForRum({
      z: 'last',
      a: '1',
      b: ['x', 'y'],
    })
    expect(q).toContain('a=1')
    expect(q).toContain('b=x')
    expect(q).toContain('b=y')
    expect(q).toContain('z=last')
    expect(q!.indexOf('a=')).toBeLessThan(q!.indexOf('b='))
  })
})
