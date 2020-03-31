import { TestBed } from '@angular/core/testing'

import { RegisterFormValidatorService } from './register-form-validator.service'

describe('RegisterFormValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RegisterFormValidatorService = TestBed.get(
      RegisterFormValidatorService
    )
    expect(service).toBeTruthy()
  })
})
