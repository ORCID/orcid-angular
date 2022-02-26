import { TestBed } from '@angular/core/testing'

import { AccountSecurityPasswordService } from './account-security-password.service'

describe('AccountSecurityPasswordService', () => {
  let service: AccountSecurityPasswordService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountSecurityPasswordService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
