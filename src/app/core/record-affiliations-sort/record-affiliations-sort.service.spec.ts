import { TestBed } from '@angular/core/testing'

import { AffiliationsSortService } from './record-affiliations-sort.service'

describe('AffiliationsSortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AffiliationsSortService = TestBed.get(
      AffiliationsSortService
    )
    expect(service).toBeTruthy()
  })
})
