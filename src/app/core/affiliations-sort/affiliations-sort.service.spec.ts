import { TestBed } from '@angular/core/testing'

import { AffiliationsSortService } from './affiliations-sort.service'

describe('AffiliationsSortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AffiliationsSortService = TestBed.inject(
      AffiliationsSortService
    )
    expect(service).toBeTruthy()
  })
})
