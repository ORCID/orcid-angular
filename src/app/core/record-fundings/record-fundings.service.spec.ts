import { TestBed } from '@angular/core/testing'

import { RecordFundingsService } from './record-fundings.service'

describe('FundingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RecordFundingsService = TestBed.get(
      RecordFundingsService
    )
    expect(service).toBeTruthy()
  })
})
