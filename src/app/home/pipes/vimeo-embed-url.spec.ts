import { TestBed } from '@angular/core/testing'
import { DomSanitizer } from '@angular/platform-browser'

import { vimeoEmbedUrl } from './vimeo-embed-url'

describe('vimeoEmbedUrl', () => {
  let sanitizer: DomSanitizer
  const pipe = {
    transform: (id: unknown) => vimeoEmbedUrl(id as string, sanitizer),
  }

  beforeEach(() => {
    sanitizer = TestBed.inject(DomSanitizer)
  })

  function asString(value: unknown): string | null {
    return value === null
      ? null
      : sanitizer.sanitize(4 /* ResourceUrl */, value as any)
  }

  it('builds the player URL for the video on the live homepage', () => {
    expect(asString(pipe.transform('1198760040'))).toBe(
      'https://player.vimeo.com/video/1198760040?dnt=1'
    )
  })

  for (const rejected of [
    '',
    'abc',
    '123abc',
    '12 34',
    '1?autoplay=1',
    '../../evil',
    'javascript:alert(1)',
    '123456789012345678901',
    null,
    undefined,
  ]) {
    it(`returns null for ${JSON.stringify(rejected)}`, () => {
      expect(pipe.transform(rejected as any)).toBeNull()
    })
  }

  it('cannot be used to inject another origin', () => {
    expect(asString(pipe.transform('1'))).toContain(
      'https://player.vimeo.com/video/1'
    )
  })
})
