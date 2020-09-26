import { TestBed } from '@angular/core/testing'

import { AffiliationsService } from './affiliations.service'

describe('AffiliationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AffiliationsService = TestBed.inject(AffiliationsService)
    expect(service).toBeTruthy()
  })
})
