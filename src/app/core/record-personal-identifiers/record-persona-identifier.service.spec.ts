import { TestBed } from '@angular/core/testing'

import { RecordPersonIdentifierService } from './record-person-identifier.service'

describe('RecordPersonalIdentifiersService', () => {
  let service: RecordPersonIdentifierService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordPersonIdentifierService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
