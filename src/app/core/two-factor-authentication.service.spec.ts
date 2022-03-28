import { TestBed } from '@angular/core/testing'
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service'

describe('TwoFactorAuthenticationService', () => {
  let service: TwoFactorAuthenticationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TwoFactorAuthenticationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
