import { HttpErrorResponse } from '@angular/common/http'
import { formatHttpErrorForRum } from './format-http-error-for-rum'

describe('formatHttpErrorForRum', () => {
  it('summarizes status-0 with ProgressEvent body', () => {
    const err = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: 'https://example.com/oauth2/authorize',
      error: { isTrusted: true } as ProgressEvent,
    })
    expect(formatHttpErrorForRum(err)).toContain('network blocked')
    expect(formatHttpErrorForRum(err)).toContain('0')
  })

  it('formats plain object from ErrorHandler spread', () => {
    const plain = {
      status: 0,
      statusText: 'Unknown Error',
      url: 'https://x/authorize',
      name: 'HttpErrorResponse',
      message: '0/HttpErrorResponse//authorize',
    }
    expect(formatHttpErrorForRum(plain)).toContain('0')
    expect(formatHttpErrorForRum(plain)).toContain('authorize')
  })
})
