import { IsUrlWithProtocolPipe } from './is-url-with-protocol.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('IsUrlWithProtocolPipe', () => {
  let pipe: IsUrlWithProtocolPipe

  beforeEach(() => {
    pipe = new IsUrlWithProtocolPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return true if is a valid url', () => {
    expect(pipe.transform('https://orcid.org')).toBe(true)
    expect(pipe.transform('HTTPS://URL.COM')).toBe(true)
    expect(pipe.transform('http://www.site.com:8008?test/ok/test%20test')).toBe(
      true
    )
  })

  it('should return false if is an invalid url', () => {
    expect(pipe.transform('orcid.org')).toBe(false)
    expect(pipe.transform('255.255.255.255')).toBe(false)
    expect(pipe.transform('https://url')).toBe(false)
  })
})
