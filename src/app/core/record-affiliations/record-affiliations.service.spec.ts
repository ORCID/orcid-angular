import { TestBed } from '@angular/core/testing'

import { RecordAffiliationService } from './record-affiliations.service'

describe('AffiliationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: RecordAffiliationService = TestBed.get(RecordAffiliationService)
    expect(service).toBeTruthy()
  })
})
