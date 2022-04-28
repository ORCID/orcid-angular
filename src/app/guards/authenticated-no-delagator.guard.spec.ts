import { TestBed } from '@angular/core/testing'

import { AuthenticatedNoDelegatorGuard } from './authenticated-no-delagator.guard'

describe('AuthenticatedNoDelegatorGuard', () => {
  let guard: AuthenticatedNoDelegatorGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(AuthenticatedNoDelegatorGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
