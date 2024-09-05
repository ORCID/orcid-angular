import { TestBed } from '@angular/core/testing'

import { AffiliationsSortService } from './record-affiliations-sort.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AffiliationsSortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AffiliationsSortService = TestBed.inject(
      AffiliationsSortService
    )
    expect(service).toBeTruthy()
  })
})
