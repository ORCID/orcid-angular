import { TestBed } from '@angular/core/testing'

import { TrustedIndividualsService } from './trusted-individuals.service'

describe('TrustedIndividualsService', () => {
  let service: TrustedIndividualsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TrustedIndividualsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
