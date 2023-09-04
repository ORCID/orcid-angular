import { TestBed } from '@angular/core/testing'

import { CanonocalUrlService } from './canonocal-url.service'

describe('CanonocalUrlService', () => {
  let service: CanonocalUrlService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CanonocalUrlService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
