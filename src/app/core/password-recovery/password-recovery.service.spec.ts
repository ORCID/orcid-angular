import { TestBed } from '@angular/core/testing'

import { PasswordRecoveryService } from './password-recovery.service'

describe('PasswordRecoveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: PasswordRecoveryService = TestBed.inject(
      PasswordRecoveryService
    )
    expect(service).toBeTruthy()
  })
})
