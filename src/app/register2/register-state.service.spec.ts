import { TestBed } from '@angular/core/testing'

import { RegisterStateService } from './register-state.service'

describe('RegisterStateService', () => {
  let service: RegisterStateService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RegisterStateService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(RegisterStateService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
