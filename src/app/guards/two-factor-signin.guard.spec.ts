import { TestBed } from '@angular/core/testing'
import { TwoFactorSigninGuard } from './two-factor-signin.guard'

describe('TwoFactorSigninGuard', () => {
  let guard: TwoFactorSigninGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(TwoFactorSigninGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
