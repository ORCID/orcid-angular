import { TestBed } from '@angular/core/testing'

import { RecordFundingService } from './record-funding.service'

describe('FundingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RecordFundingService = TestBed.get(
      RecordFundingService
    )
    expect(service).toBeTruthy()
  })
})
