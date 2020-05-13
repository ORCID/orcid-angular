import { TestBed } from '@angular/core/testing'

import { DiscoService } from './disco.service'

describe('DiscoService', () => {
  let service: DiscoService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DiscoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
