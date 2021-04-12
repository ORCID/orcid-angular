import { TestBed } from '@angular/core/testing'

import { FundingsSortService } from './record-fundings-sort.service'

describe('FundingsSortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: FundingsSortService = TestBed.inject(FundingsSortService)
    expect(service).toBeTruthy()
  })
})
