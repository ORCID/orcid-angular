import { TestBed } from '@angular/core/testing'

import { ReactivationService } from './reactivation.service'

describe('ReactivationService', () => {
  let service: ReactivationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ReactivationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
