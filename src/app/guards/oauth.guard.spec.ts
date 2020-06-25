import { TestBed } from '@angular/core/testing'

import { OauthGuard } from './oauth.guard'

describe('OauthGuard', () => {
  let guard: OauthGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(OauthGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
