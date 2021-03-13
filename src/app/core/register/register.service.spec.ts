import { TestBed } from '@angular/core/testing'

import { RegisterService } from './register.service'

describe('RegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RegisterService = TestBed.inject(RegisterService)
    expect(service).toBeTruthy()
  })
})
