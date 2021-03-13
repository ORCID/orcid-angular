import { TestBed } from '@angular/core/testing'

import { RecordAffiliationsGroupingService } from './record-affiliations-grouping.service'

describe('RecordAffiliationsGroupingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RecordAffiliationsGroupingService = TestBed.get(
      RecordAffiliationsGroupingService
    )
    expect(service).toBeTruthy()
  })
})
