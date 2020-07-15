import { TestBed } from '@angular/core/testing'

import { SignInGuard } from './sign-in.guard'

describe('SignInGuard', () => {
  let guard: SignInGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(SignInGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
