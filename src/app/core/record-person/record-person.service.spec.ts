import { TestBed } from '@angular/core/testing'

import { RecordPersonService } from './record-person.service'

describe('RecordPersonService', () => {
  let service: RecordPersonService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordPersonService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
