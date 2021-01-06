import { TestBed } from '@angular/core/testing'

import { ThirdPartySigninCompletedGuard } from './third-party-signin-completed.guard'

describe('ThirdPartySigninCompletedGuard', () => {
  let guard: ThirdPartySigninCompletedGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(ThirdPartySigninCompletedGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
