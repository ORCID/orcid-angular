import { IsUrlPipe } from './is-url.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('IsUrlPipe', () => {
  let pipe: IsUrlPipe

  beforeEach(() => {
    pipe = new IsUrlPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return true if is a valid url', () => {
    expect(pipe.transform('orcid.org')).toBe(true)
    expect(pipe.transform('http://www.site.com:8008')).toBe(true)
    expect(
      pipe.transform(
        'https://doi.org/10.1175/1520-0426(2000)017< 0854:aeosrb>2.0.co;2'
      )
    ).toBe(true)
  })

  it('should return false if is an invalid url', () => {
    expect(pipe.transform('url')).toBe(false)
    expect(
      pipe.transform(
        'https%3A%2F%2Fdoi.org%2F10.1175%2F1520-0426(2000)017%3C%200854%3Aaeosrb%3E2.0.co%3B2'
      )
    ).toBe(false)
  })
})
