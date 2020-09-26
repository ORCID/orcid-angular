import { TestBed } from '@angular/core/testing'

import { AffiliationsGroupingService } from './affiliations-grouping.service'

describe('AffiliationsGroupingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AffiliationsGroupingService = TestBed.inject(
      AffiliationsGroupingService
    )
    expect(service).toBeTruthy()
  })
})
