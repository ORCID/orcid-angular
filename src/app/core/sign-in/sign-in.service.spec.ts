import { TestBed } from '@angular/core/testing'

import { SignInService } from './sign-in.service'

describe('SignInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: SignInService = TestBed.inject(SignInService)
    expect(service).toBeTruthy()
  })
})
