import { TestBed } from '@angular/core/testing'

import { RecordNamesService } from './record-names.service'

describe('RecordNamesService', () => {
  let service: RecordNamesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordNamesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
