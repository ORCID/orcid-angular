import { TestBed } from '@angular/core/testing'

import { AccountSecurityAlternateSignInService } from './account-security-alternate-sign-in.service'

describe('AccountSecurityAlternateSignInService', () => {
  let service: AccountSecurityAlternateSignInService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountSecurityAlternateSignInService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
